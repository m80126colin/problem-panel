<template>
<section class="about">
  <div class="ui form">
  <div class="field">
    <label>Search</label>
    <input type="text" v-model.trim="qs" placeholder="搜尋 ...">
  </div>
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
        <input type="hidden" name="tag" v-model.lazy="ts">
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
  <div class="ui stackable grid">
    <div class="four wide column" v-for="(group, gid) in query" :key="`group-${gid}`">
    <div class="ui segment">
      <div v-for="list in group.taglist" :key="`taglist-${gid}-${list.isnew}`">
        <span v-for="tag in list.tag" :key="`tag-${gid}-${list.isnew}-${tag}`"
          :class="`ui basic circular${list.isnew ? ' green': ''} label`">{{ tag }}</span>
      </div>
      <div class="ui list">
      <div class="item" v-for="(prob, pid) in group.problist" :key="`prob-${gid}-${pid}`">
        <div class="content">
        <div class="header">
          {{ prob.problem }}
          <a :href="prob.link" target="_blank">
            <i v-if="prob.link" class="arrow alternate circle right outline icon"></i>
          </a>
        </div>
        <div class="meta">{{ prob.name }}</div>
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
      qs: '',
      js: '',
      ts: '',
      list: []
    }
  },
  async mounted() {
    const app = this
    const { data : rows } = await axios.get('//m80126colin.github.io/Judge/data.json')
    app.list = _.chain(rows)
      .map(row => _.merge(row, {
        searchTag:  _.chain(row.taglist).flatMap(list => list.tag).uniqBy().sort().value(),
        searchProb: _.flatMap(row.problist, prob => prob.problem),
        problist:   _.map(row.problist, prob => _.merge(prob, { link: renderLink(prob) }))
      }))
      .value()
    $('.ui.dropdown').dropdown({ clearable: true })
  },
  computed: {
    judgeList() {
      const app = this
      return _.chain(app.list)
        .flatMap(group => _.map(group.problist, prob => prob.judge))
        .uniqBy()
        .sort()
        .value()
    },
    tagList() {
      const app = this
      return _.chain(app.list)
        .flatMap(group => group.searchTag)
        .uniqBy()
        .sort()
        .value()
    },
    query() {
      const app = this
      const rows = _.chain(app.list)
        .filter(group => app.js === '' || _.some(group.searchProb, problem => problem.includes(app.js)))
        .filter(group => app.ts === '' || _.some(group.searchTag,  tag     => tag === app.ts))
        .filter(group => app.qs === '' || _.some(_.concat(group.searchProb, group.searchTag), str => str.includes(app.qs)))
        .value()
      return rows
    }
  }
}
</script>

<style scoped>
.ui.label {
  margin: 0.2rem;
}
</style>