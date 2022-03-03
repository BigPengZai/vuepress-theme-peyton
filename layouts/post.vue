<template>
  <div class="post">
    <article class="main-div">
      <Content class="post-content content" />
    </article>

    <div v-if="vssueEnable" class="main-div vssue-div">
      <Vssue :title="vssueTitle" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Post",
  computed: {
    vssueEnable() {
      return this.$themeConfig.comments !== false && this.vssueTitle;
    },
    vssueTitle() {
      return this.$page.frontmatter.title || undefined;
    },
  },
};
</script>

<style lang="stylus">
.vssue-div
  margin-top 1rem
</style>
