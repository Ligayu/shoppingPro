<template>
  <view class="inp_wrap">
    <input
      type="text"
      :value="text"
      @input="handleInput"
    />
    <view class="list">
      <view
        v-for="item in list"
        :key="item.goods_id"
      >{{item.goods_name}}</view>
    </view>
  </view>

</template>

<script>
let timeId = -1;

export default {
  data() {
    return {
      text: "",
      list: []
    };
  },
  methods: {
    handleInput(e) {
      const value = e.target.value;
      if (value.trim()) {
        clearTimeout(timeId);
        timeId = setTimeout(() => {
          this.getList(e.target.value);
        }, 1000);
      } else {
        this.list = [];  
      }
    },
    async getList(text) {
      const res = await this.request({
        url: "/goods/qsearch",
        data: {
          query: text
        }
      });
      this.list = res;
    }
  }
};
</script>

<style lang="scss"  >
.inp_wrap {
  input {
    border: 1px solid #000;
  }
}
</style>