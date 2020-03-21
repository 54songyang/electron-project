<template>
  <div class="fllow-body">
    <div v-for="item in list" :key="item.userId">
      <p>{{item.nickname}}</p>
      <div>{{item.signature}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userPage",
  data() {
    return {
      list:[],
    };
  },
  computed: {
    params() {
      return this.$route.params;
    }
  },
  methods: {
    getList() {
      if(!this.params.userId) this.$router.push('mainPage')
      this.$axios({
        type: "get",
        url: `http://localhost:3000/user/follows?uid=${this.params.userId}`
      })
        .then(res => {
          console.log("res", res);
          if (res.status === 200) this.list = res.data.follow;
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style>
</style>