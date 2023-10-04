<template>
  <div id="app">
    <div class="h-screen p-3">hello world</div>
    <div class="h-screen p-3">
      <!-- components:
          - dropdown (select/multiselect) ✅
          - dialog ✅
          - input ✅
          - button ✅
          - tags 🤦🏻‍♂️
          - time range picker 🕗
          - hint 🕗
    -->

      <div class="mb-3">
        <b-input
          v-model.number="inputValue"
          type="number"
          class="p-1 px-2 rounded-lg ring-1 focus:outline-none focus:ring-2 ring-primary"
        />
        {{ inputValue || "empty" }}
      </div>
      <div class="mb-3">
        <b-button
          @click.native="showDialog = true"
          class="px-2 py-1 text-white border rounded-xl bg-primary"
        >
          open dialog
        </b-button>
        <b-dialog v-model="showDialog">
          <div class="p-3 bg-white rounded-lg shadow-lg">
            <h1 class="text-xl font-bold">Dialog</h1>
            <p class="text-gray-500">Lorem ipsum dolor sit amet.</p>
          </div>
        </b-dialog>
      </div>
      <div class="mb-3">
        <div class="flex">
          <b-time-picker />
        </div>
      </div>
      <div class="mb-3">
        <div class="max-w-[250px]">
          <b-dropdown
            :options="options"
            v-model="dropdownSelectedOption"
            searchKey="title"
            selectKey="id"
            active-class="text-white bg-primary hover:bg-blue-500"
            multiselect
          >
            <template #d-header>
              <template v-if="dropdownSelectedOption?.length">
                <div
                  v-for="(options, i) in dropdownSelectedOption"
                  :key="i"
                  class="py-0.5 px-2 border rounded-md cursor-pointer border-blue-500 max-w-[90px] truncate duration-200 hover:bg-blue-500 hover:scale-95 hover:text-white"
                  @click.stop="filterOption(options)"
                >
                  {{ options.title }}
                </div>
              </template>
              <template v-else>
                <div>Select some options</div>
              </template>
            </template>
            <template #d-body="{ option }">
              <div>
                <div>{{ option.selected }}</div>
                <div>{{ option.option.title }}</div>
              </div>
            </template>
            <template #d-body-empty>
              <div class="p-2 text-sm text-center text-gray-600">
                No options found
              </div>
            </template>
          </b-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BDialog from "./components/App/BDialog.vue";
import BInput from "./components/App/BInput.vue";
import BButton from "./components/App/BButton.vue";
import BTimePicker from "./components/App/BTimePicker.vue";
import BDropdown from "./components/App/BDropdown.vue";
import { printout } from "./utils/console";
export default {
  components: { BInput, BDialog, BButton, BTimePicker, BDropdown },
  name: "App",
  data() {
    return {
      inputValue: "",
      showDialog: false,
      dropdownSelectedOption: null,
      options: [
        {
          userId: 1,
          id: 1,
          title:
            "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
          body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        },
        {
          userId: 1,
          id: 2,
          title: "qui est esse",
          body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
        },
        {
          userId: 1,
          id: 3,
          title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
          body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
        },
        {
          userId: 1,
          id: 4,
          title: "eum et est occaecati",
          body: "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit",
        },
        {
          userId: 1,
          id: 5,
          title: "nesciunt quas odio",
          body: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
        },
        {
          userId: 1,
          id: 6,
          title: "dolorem eum magni eos aperiam quia",
          body: "ut aspernatur corporis harum nihil quis provident sequi\nmollitia nobis aliquid molestiae\nperspiciatis et ea nemo ab reprehenderit accusantium quas\nvoluptate dolores velit et doloremque molestiae",
        },
        {
          userId: 1,
          id: 7,
          title: "magnam facilis autem",
          body: "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas",
        },
        {
          userId: 1,
          id: 8,
          title: "dolorem dolore est ipsam",
          body: "dignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae",
        },
        {
          userId: 1,
          id: 9,
          title: "nesciunt iure omnis dolorem tempora et accusantium",
          body: "consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas",
        },
        {
          userId: 1,
          id: 10,
          title: "optio molestias id quia eum",
          body: "quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error",
        },
      ],
    };
  },
  watch: {
    dropdownSelectedOption(val) {
      printout(val, "dropdownSelectedOption");
    },
  },
  methods: {
    filterOption(opt) {
      if (!this.dropdownSelectedOption?.length) return;

      this.dropdownSelectedOption = this.dropdownSelectedOption.filter(
        (option) => option.id !== opt.id
      );
    },
  },
};
</script>
