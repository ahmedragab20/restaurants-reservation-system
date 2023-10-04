<!--
  this component will be prestyled, with ability to strip out the styles and use your own
  -- the reason is that the dropdown is a very common component, and it's styling might be difficult to recreate it from scratch
  -- so we will provide a styled version, and a bare version
-->
<template>
  <div class="relative">
    <!-- D Header -->
    <div @click="onHeaderClick">
      <template v-if="!styless">
        <div
          class="flex justify-between gap-1 p-2 border rounded-lg cursor-pointer select-none"
          :class="headerClasses"
        >
          <div class="w-[calc(100%-40px)] flex-grow flex flex-wrap gap-1">
            <slot name="d-header" />
          </div>
          <div
            v-if="downArrow"
            class="flex items-center justify-center flex-shrink-0 w-8"
          >
            <i
              class="text-sm text-gray-700 duration-300 bi bi-play-fill"
              :class="{
                '-rotate-90': displayBody,
                'rotate-90': !displayBody,
              }"
            ></i>
          </div>
        </div>
      </template>
      <template v-else>
        <slot name="d-header" />
      </template>
    </div>
    <!-- D Body -->
    <Transition name="d-body">
      <div
        v-if="displayBody"
        class="absolute z-10 w-full p-2 overflow-auto bg-white top-[105%] max-h-60"
        :class="[
          {
            'border rounded-lg shadow-lg': !styless,
          },
          bodyClasses,
        ]"
      >
        <div
          v-if="!!searchKey"
          :class="{
            'h-0 opacity-0 pointer-events-none overflow-hidden':
              hideSearchInput,
          }"
        >
          <template v-if="!styless">
            <b-input
              ref="searchInput"
              v-model="search"
              type="text"
              placeholder="Search..."
              class="w-full p-1 px-2 text-center rounded-lg ring-1 focus:outline-none focus:ring-2 focus:ring-primary ring-transparent bg-slate-50 focus:bg-slate-100"
            />
          </template>
          <template v-else>
            <b-input
              ref="searchInput"
              v-model="search"
              type="text"
              placeholder="Search..."
            />
          </template>
        </div>
        <template v-if="filteredOptions?.length">
          <div
            v-for="(option, index) in filteredOptions"
            :key="index"
            :class="[
              {
                'flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100':
                  !styless,
              },
              optionSelected?.(option) ? activeClass : '',
              optionClasses,
            ]"
            @click="onOptionClick(option)"
          >
            <slot
              name="d-body"
              :option="option"
              :selected="optionSelected(option)"
            />
          </div>
        </template>
        <template v-else>
          <slot name="d-body-empty" />
        </template>
      </div>
    </Transition>
  </div>
</template>

<script>
import { printerr } from "@/utils/console.js";
import BInput from "./BInput.vue";
export default {
  components: { BInput },
  props: {
    /**
     * options is an array of strings or objects
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * value is the v-model value
     */
    value: {
      type: [String, Array, Object],
      default: () => null,
    },
    /**
     * styless is used to strip out the default styles
     */
    styless: {
      type: Boolean,
      default: false,
    },
    /**
     * multiselect is used to allow multiple options to be selected
     */
    multiselect: {
      type: Boolean,
      default: false,
    },
    /**
     * disabled is used to disable the dropdown
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * downArrow is used to show/hide the down arrow
     */
    downArrow: {
      type: Boolean,
      default: true,
    },
    /**
     * selectKey is used to select the key of the object to be used as the value (only used if options is an array of objects and multiselect is true)
     */
    selectKey: {
      type: String,
      default: "id",
    },
    /**
     * the key to be used to filter the options (only used if options is an array of objects)
     */
    searchKey: {
      type: String,
      default: "",
    },
    hideSearchInput: {
      type: Boolean,
      default: true,
    },
    /**
     * more header classes
     */
    headerClasses: {
      type: String,
      default: "",
    },
    /**
     * more body classes
     */
    bodyClasses: {
      type: String,
      default: "",
    },
    /**
     * more option classes
     */
    optionClasses: {
      type: String,
      default: "",
    },
    /**
     * active class is used to style the active option(s)
     */
    activeClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /**
       * selectedOption can hold the following types:
       * - null
       * - string
       * - array of strings
       * - object
       * - array of objects
       */
      selectedOption: null,
      /**
       * displayBody is used to toggle the dropdown body
       */
      displayBody: false,
      /**
       * search is used to filter the options
       */
      search: "",
    };
  },
  computed: {
    /**
     * filteredOptions is used to filter the options based on the search input
     */
    filteredOptions() {
      if (!this.search) {
        return this.options;
      }
      return this.options.filter((option) => {
        const optionsType = typeof option;
        if (optionsType === "object") {
          return option[this.searchKey]
            .toLowerCase()
            .includes(this.search.toLowerCase());
        } else {
          return option.toLowerCase().includes(this.search.toLowerCase());
        }
      });
    },
  },
  watch: {
    /**
     * when the value prop changes, update the selectedOption
     */
    value: {
      handler(newValue, oldValue) {
        console.log("value changed", { newValue, oldValue });
        this.selectedOption = newValue;
      },
      immediate: true,
    },
    /**
     * when the displayBody prop changes, reset the search input
     */
    displayBody(newValue) {
      if (!newValue) {
        this.search = "";
      }
    },
  },
  methods: {
    /**
     * - triggers emit to parent component (header-clicked)
     * - toggle dropdown (id not disabled)
     */
    onHeaderClick() {
      this.$emit("header-clicked");
      if (!this.disabled) {
        this.displayBody = !this.displayBody;
      }
    },
    /**
     * - triggers emit to parent component (option-clicked) wuth option (options if multiselect) as payload
     * - if multiselect is true, then add/remove option from selectedOptions
     * - if multiselect is false, then set selectedOption to option
     * @param {Any} option
     */
    onOptionClick(option) {
      if (this.multiselect) {
        const optionsType = typeof this.options?.[0];

        if (!optionsType) {
          printerr(
            "BDropdown",
            "onOptionClick",
            "options array is empty",
            "error"
          );

          this.$emit("option-clicked", []);
          this.$emit("input", []);
          return;
        }

        if (optionsType === "object") {
          const optionIndex = this.selectedOption.findIndex(
            (item) => item[this.selectKey] === option[this.selectKey]
          );
          if (optionIndex === -1) {
            this.selectedOption.push(option);
          } else {
            this.selectedOption.splice(optionIndex, 1);
          }
        } else {
          const optionIndex = this.selectedOption.findIndex(
            (item) => item === option
          );
          if (optionIndex === -1) {
            this.selectedOption.push(option);
          } else {
            this.selectedOption.splice(optionIndex, 1);
          }
        }
      } else {
        this.selectedOption = option;
        this.displayBody = false;
      }

      // emit option-clicked event with the new selectedOption data
      this.$emit("option-clicked", this.selectedOption);
      // update the v-model value with the new selectedOption data
      this.$emit("input", this.selectedOption);
    },
    /**
     * does option selected?
     */
    optionSelected(option) {
      if (this.multiselect) {
        const optionsType = typeof this.options?.[0];

        if (!optionsType) {
          printerr(
            "BDropdown",
            "optionSelected",
            "options array is empty",
            "error"
          );
          return false;
        }

        if (optionsType === "object") {
          return this.selectedOption.some(
            (item) => item[this.selectKey] === option[this.selectKey]
          );
        } else {
          return this.selectedOption.some((item) => item === option);
        }
      } else {
        return this.selectedOption === option;
      }
    },
  },
  mounted() {
    // close dropdown if clicked outside
    addEventListener("click", (e) => {
      if (!this.$el.contains(e.target)) {
        this.displayBody = false;
      }
    });

    // start searching when typing
    if (this.searchKey) {
      addEventListener("keydown", (e) => {
        this.$nextTick(() => {
          if (e.key && this.$refs.searchInput?.$el) {
            this.$refs.searchInput.$el.focus();
            this.$refs.searchInput.$el.value = this.search;
          }
        });
      });
    }
  },
  created() {
    // setup the component
    if (this.multiselect) {
      this.selectedOption = [];
    }
    if (this.value) {
      this.selectedOption = this.value;
    }
  },
};
</script>
<style>
.d-body-enter-active,
.d-body-leave-active {
  transition: all 0.2s ease;
}

.d-body-enter-from,
.d-body-leave-to {
  opacity: 0;
  transform: translateY(-1px);
}
</style>
