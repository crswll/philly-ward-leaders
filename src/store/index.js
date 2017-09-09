import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { createClient } from 'contentful'

import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '../config'

Vue.use(Vuex)

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN
})

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    leaders: [],
    committeePersons: [] // Of ward currently in view
  },
  mutations: {
    FETCH_LEADERS_SUCCESS (state, leaders) {
      state.leaders = leaders
    },
    FETCH_COMMITTEE_PERSONS_SUCCESS (state, committeePersons) {
      state.committeePersons = committeePersons
    }
  },
  actions: {
    async FETCH_LEADERS ({ commit }) {
      const response = await client.getEntries({ content_type: 'wardLeader' })
      const leaders = response.items.map((item) => item.fields)
      commit('FETCH_LEADERS_SUCCESS', leaders)
    },
    async FETCH_COMMITTEE_PERSONS ({ commit }, ward) {
      const url = `https://data.phila.gov/carto/api/v2/sql?q=SELECT * FROM elected_committee_people WHERE ward = ${ward}`
      const response = await axios.get(url)
      const committeePersons = response.data.rows
      commit('FETCH_COMMITTEE_PERSONS_SUCCESS', committeePersons)
    }
  }
})

export default store
