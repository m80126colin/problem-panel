<template>
<section class="about">
  <div class="ui form">
  <div class="two fields">
  <div class="field">
    <label>Judge</label>
    <div class="ui fluid search selection dropdown">
      <input type="hidden" name="judge" v-model.lazy="js">
      <div class="default text">選擇 Judge</div>
      <i class="dropdown icon"></i>
      <div class="menu">
        <div class="item" :data-value="judge" v-for="judge in judgeList" :key="`judge-${judge}`">{{ judge }}</div>
      </div>
    </div>
  </div>
  <div class="field">
    <label>Tag</label>
    <div class="ui fluid search selection dropdown">
      <input type="hidden" name="tag" v-model.lazy="qs">
      <div class="default text">選擇 Tag</div>
      <i class="dropdown icon"></i>
      <div class="menu">
        <div class="item" :data-value="tag" v-for="tag in tagList" :key="`tag-${tag}`">{{ tag }}</div>
      </div>
    </div>
  </div>
  </div>
  </div>
  <article class="ui basic segment">
  <div class="ui grid">
    <div class="four wide column" v-for="prob in query" :key="`prob-${prob.judge}-${prob.id}`">
      <div class="ui items">
      <div class="item">
        <div class="content">
          <div class="header">{{ prob.name }}</div>
          <div class="meta">
            <a v-if="prob.link" :href="prob.link" class="ui blue circular empty label" target="_blank"></a>
            {{ prob.judge }} {{ prob.id }}
          </div>
          <div class="description">
            <span v-for="tag in prob.tag" :key="`pt-${prob.judge}-${prob.id}-${tag}`"
              class="ui basic circular label">{{ tag }}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
  </article>
</section>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

const renderLink = row => {
  switch (row.judge) {
    case 'ZeroJudge':
      return `https://zerojudge.tw/ShowProblem?problemid=${row.id}`
    case 'TIOJ':
      return `https://tioj.ck.tp.edu.tw/problems/${row.id}`
    case 'CodeForces':
      const first = _.chain(row.id).initial().join('').value()
      return `https://codeforces.com/problemset/problem/${first}/${row.id.substr(-1)}`
    default:
      return undefined
  }
}

export default {
  data() {
    return {
      js: '',
      qs: '',
      list: []
    }
  },
  async mounted() {
    const app = this
    const { data : rows } = await axios.get('//m80126colin.github.io/Judge/data.json')
    app.list = _.map(rows, row => _.merge(row, { link: renderLink(row) }))
    $('.ui.dropdown').dropdown({ clearable: true })
  },
  computed: {
    judgeList() {
      const app = this
      return _.chain(app.list)
        .map(prob => prob.judge)
        .uniqBy()
        .sort()
        .value()
    },
    tagList() {
      const app = this
      return _.chain(app.list)
        .flatMap(prob => prob.tag)
        .uniqBy()
        .sort()
        .value()
    },
    query() {
      const app = this
      const temp = _.chain(app.list)
        .filter(prob => app.js === '' || prob.judge === app.js)
        .filter(prob => _.findIndex(prob.tag, t => app.qs === '' || t === app.qs) >= 0)
        .value()
      return temp
    }
  }
}
</script>

<style scoped>
.ui.label {
  margin: 0.2rem;
}
</style>