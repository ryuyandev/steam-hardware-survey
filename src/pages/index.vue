<template>
    <div id="app" v-if="data" style="background: #1b2838; opacity: 0" :style="{ background: appBackground, opacity: loaded ? 1 : 0 }">
        <header class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Steam Graphics Card Popularity<span>GTX 1060 or lesser</span>
                    </h1>
                    <h2 class="subtitle">
                        {{ date }}
                    </h2>
                </div>
            </div>
        </header>
        <main class="section">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Users with GTX 1060 or lesser
                    </p>
                </header>
                <div class="card-content">
                    <div class="content has-text-centered">
                        {{ data.total }}%
                    </div>
                </div>
            </div>
            <section class="stats section">
                <h2>Statistics</h2>
                <b-table
                    :data="data.stats"
                    default-sort-direction="desc"
                    sort-icon="chevron-up"
                    sort-icon-size="is-small"
                    default-sort="percentage">
                    <template slot-scope="props">
                        <b-table-column field="name" label="Name" sortable>
                            {{ props.row.name }}
                        </b-table-column>
                        <b-table-column field="rank" label="Rank" sortable numeric>
                            {{ props.row.rank }}
                        </b-table-column>
                        <b-table-column field="percentage" label="Popularity" sortable numeric>
                            {{ props.row.percentage.toFixed(2) }}%
                        </b-table-column>
                    </template>
                </b-table>
            </section>
        </main>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    GPU popularity from <a href="https://store.steampowered.com/hwsurvey/" target="_blank">Steam Hardware Survey</a><br />
                    GPU ranking from <a href="https://www.userbenchmark.com/page/developer" target="_blank">UserBenchmark data files</a><br /><br />
                    <a href="#" @click.prevent="aboutDialog">About</a>
                    <span v-if="olderUrl">
                        | <a :href="olderUrl">Show Older Data</a>
                    </span>
                </p>
            </div>
        </footer>
    </div>
    <div id="app" class="no-data" v-else :style="{ background: appBackground }">
        No Available Data
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState(['siteRoot', 'data', 'olderUrl']),
        appBackground() {
            return `url('${this.siteRoot}default-bg.png') center top no-repeat #1b2838`
        },
        date() {
            const date = new Date(this.data.date)
            return `${date.toLocaleDateString('default', { month: 'long' })} ${date.getFullYear()}`
        }
    },
    data() {
        return {
            loaded: false
        }
    },
    methods: {
        aboutDialog() {
            this.$buefy.dialog.alert({
                title: 'About',
                message: `At the time of the creation of this page, the most popular graphics card among steam users was the GTX 1060.
As that card is aging, I was interested in knowing what percentage of steam users had that card or anything less potent, and I was interested in tracking that number over time.
This page will automatically update as new hardware survey data is available, with older data also available via the "Show Older Data" link,
or by appending the requested year and month to the url like so:<br /><br /><a href="${this.siteRoot}2020/6">http://ryuyan.ninja${this.siteRoot}2020/6</a>`,
                confirmText: 'kthx'
            })
        }
    },
    created() {
        if (process.browser && document.readyState !== 'complete') {
            window.addEventListener('load', () => {
                this.loaded = true
                this.$nuxt.$loading.finish()
            })
            this.$nextTick(() => {
                if (!this.loaded)
                    this.$nuxt.$loading.start()
            })
        }
    }
}
</script>

<style lang="scss">
html {
    background-color: #171a21;

    #app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        transition: opacity .5s ease;

        &.no-data {
            justify-content: center;
            text-align: center;
            color: #FFF;
            font-size: 64px;
        }

        a {
            color: #C6D4DF;

            &:hover {
                color: #FFF;
            }
        }

        header.hero {
            background-color: #171a21;

            .title {
                color: #c6d4df;

                span {
                    font-size: 1.7rem;
                    opacity: 0.7;
                    display: block;
                    margin-top: 7px;

                    @media screen and (min-width: 769px) {
                        & {
                            margin-left: 14px;
                            display: inline;
                        }

                        &::before {
                            content: '['
                        }

                        &::after {
                            content: ']'
                        }
                    }
                }
            }

            .subtitle {
                color: #b8b6b4;
            }
        }

        main.section {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            h2 {
                color: #C6D4DF;
                font-size: 21px;
                margin-bottom: 7px;
            }

            .card {
                min-width: 327px;

                .card-header-title {
                    justify-content: center;
                }

                .card-content .content {
                    font-size: 4rem;
                }
            }

            section.stats {
                width: 100%;

                .select:not(.is-multiple):not(.is-loading)::after {
                    border-color: #171a21;
                }

                .table {
                    border-radius: 0;
                    background-color: transparent;                

                    th {
                        user-select: none;
                    }

                    tr {
                        background-color: white;
                    }
                }
            }
        }

        footer.footer {
            padding: 3rem 1.5rem;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.5) 100%);
            color: #8F98A0;
        }
    }
}
</style>