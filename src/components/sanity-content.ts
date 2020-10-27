import defu from "defu"

import { h } from "vue"

import type { VNode, VNodeData, VueConstructor } from "vue"

import type { FunctionalComponentOptions } from "vue"
import type { ExtendedVue } from "vue/types/vue"
import type { RecordPropsDefinition } from "vue/types/options"

const extendVue = <Props>(
  definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>
) => (definition as unknown) as ExtendedVue<Vue, {}, {}, {}, Props>

interface MarkDefs {
  _key: string
  _type: string
  [key: string]: string
}

interface Children {
  _key: string
  _type: string
  marks: string[]
  text: string
}

interface Block {
  _type: "block"
  _key: string
  children: Children[]
  level?: number
  listItem?: string
  markDefs: MarkDefs[]
  style: string
}

interface CustomBlock {
  _type: "custom"
  _key: string
  [key: string]: any
}

interface List {
  _type: "list"
  children: Array<CustomBlock | Block | List>
  [key: string]: any
}

export interface Serializers {
  /**
   * block components or elements that render non-blocks
   */
  types?: Record<
    string,
    VueConstructor<Vue> | (() => VueConstructor<Vue>) | string
  >
  /**
   * inline components or elements
   */
  marks?: Record<
    string,
    VueConstructor<Vue> | (() => VueConstructor<Vue>) | string
  >
  /**
   * block components or elements that wrap blocks instead of `<p>` tags
   */
  styles?: Record<
    string,
    VueConstructor<Vue> | (() => VueConstructor<Vue>) | string
  >
  listItem?: VueConstructor<Vue> | string
  container?: VueConstructor<Vue> | string
}

const defaults: Required<Serializers> = {
  types: {
    span: "span",
  },
  marks: {
    strong: "strong",
    link: "a",
  },
  styles: {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    normal: "p",
  },
  listItem: "li",
  container: "div",
}

let level = 1

function getProps(item?: Record<string, any>) {
  if (!item) {
    return {}
  }

  const obj = Object.entries(item).reduce(
    (obj, [key, value]) => {
      switch (true) {
        case (["key"] as Array<keyof VNodeData>).includes(
          key as keyof VNodeData
        ):
          obj[key as keyof VNodeData] = value
          return obj

        case ["class", "href"].includes(key):
          obj.attrs![key] = value
          return obj

        // Types to exclude completely
        case ["_type"].includes(key):
          return obj

        // Pass everything else as props
        default:
          obj.props![key] = value
          return obj
      }
    },
    {
      props: {},
      attrs: {},
    } as VNodeData
  )

  obj.props = {
    level,
    ...obj.props,
  }
  return obj
}

function findSerializer(
  item: CustomBlock | Block | List | Block["markDefs"][number] | undefined,
  serializers: Required<Serializers>
) {
  if (!item) return undefined

  const { _type, listItem } = item

  return listItem
    ? serializers.listItem || "li"
    : _type && _type in serializers.types
    ? serializers.types[_type]
    : _type && _type in serializers.marks
    ? serializers.marks[_type]
    : undefined
}

export const SanityContent = extendVue({
  name: "SanityContent",
  props: {
    blocks: {
      type: Array as () => Array<CustomBlock | Block>,
      default: () => [] as Array<CustomBlock | Block>,
    },
    serializers: {
      type: Object as () => Serializers,
      default: () => ({} as Serializers),
    },
    renderContainerOnSingleChild: { type: Boolean, default: false },
  },
  render(props, context) {
    function wrapStyle(
      { style, listItem }: CustomBlock | Block | List,
      serializers: Required<Serializers>,
      children: Array<VNode | string>
    ) {
      const matches = style ? style.match(/^h(\d)$/) : []
      if (!listItem && matches && matches.length > 1) {
        level = Number(matches[1])
      }
      if (!listItem && style && serializers.styles[style]) {
        return h(serializers.styles[style], {}, children)
      }

      return children
    }

    function wrapInSerializer(
      item: CustomBlock | Block | List | Block["markDefs"][number],
      content: Array<VNode | string>,
      serializers: Required<Serializers>
    ) {
      const serializer = findSerializer(item, serializers)
      if (!serializer) return content

      return [h(serializer, getProps(item), content)]
    }

    function wrapMarks(
      content: VNode | string,
      [mark, ...marks]: Block["children"][number]["marks"] = [],
      serializers: Required<Serializers>,
      markDefs: Block["markDefs"]
    ): VNode | string {
      if (!mark) return content

      const definition =
        mark in serializers.marks
          ? { _type: mark, _key: "" }
          : markDefs.find((m) => m._key === mark)

      return h(
        findSerializer(definition, serializers) || "span",
        getProps(definition),
        [wrapMarks(content, marks, serializers, markDefs)]
      )
    }

    function renderBlocks(
      blocks: Array<CustomBlock | Block | List>,
      serializers: Required<Serializers>,
      nested = false
    ) {
      const nestedBlocks = nested
        ? blocks
        : blocks.reduce((blocks, block) => {
            const { length } = blocks

            if (block.level && length) {
              const { _type, children } = blocks[length - 1]
              if (_type === "list" && children) {
                children.push(block)
              } else {
                blocks.push({
                  _type: "list",
                  children: [block],
                } as List)
              }
            } else {
              blocks.push(block)
            }
            return blocks
          }, [] as Array<Block | CustomBlock | List>)

      return nestedBlocks.map((block) => {
        const node = wrapStyle(
          block,
          serializers,
          wrapInSerializer(
            block,
            block._type === "block"
              ? (block.children || []).map((child) =>
                  wrapMarks(
                    child.text,
                    child.marks,
                    serializers,
                    block.markDefs
                  )
                )
              : [],
            serializers
          )
        )
        if (process.env.NODE_ENV === "development") {
          if (!node || (Array.isArray(node) && !node.length))
            console.warn(
              `No serializer found for block type "${block._type}".`,
              block
            )
        }
        return node
      })
    }

    const serializers = defu(props.serializers, defaults) as Required<
      Serializers
    >

    serializers.types.list =
      serializers.types.list ||
      extendVue({
        name: "ListComponent",
        props: {
          children: {
            type: Array as () => Array<Block | CustomBlock | List>,
            default: () => [] as Array<Block | CustomBlock | List>,
          },
        },
        render(props, context) {
          console.log(props, context)
          console.log(context)
          const tag =
            context.slots?.length && context.slots[0].listItem === "number"
              ? "ol"
              : "ul"
          return h(tag, {}, renderBlocks(context.slots, serializers, true))
        },
      })

    return h(
      serializers.container,
      context.attrs,
      renderBlocks(props.blocks || [], serializers)
    )
  },
})
