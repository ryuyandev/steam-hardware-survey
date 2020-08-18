<template>
    <div id="app" class="no-data" v-if="!data" :style="{ background: appBackground }">
        No Available Data
    </div>
    <div id="app" v-else style="background: #1b2838; opacity: 0" :style="{ background: appBackground, opacity: loaded ? 1 : 0 }">
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
            <div class="hero-foot">
                <nav class="tabs">
                    <div class="container">
                        <ul>
                            <li v-if="data.prev">
                                <a :href="data.prev">Previous Month</a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="aboutDialog">About</a>
                            </li>
                            <li v-if="data.next">
                                <a :href="data.next">Next Month</a>
                            </li>
                        </ul>
                    </div>
                </nav>
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
                    default-sort="percentage"
                    :striped="true"
                >
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
        <section class="section">
        </section>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    GPU popularity from <a href="https://store.steampowered.com/hwsurvey/" target="_blank">Steam Hardware Survey</a><br />
                    GPU ranking from <a href="https://www.userbenchmark.com/page/developer" target="_blank">UserBenchmark data files</a><br /><br />
                    <span v-if="data.prev">
                        <a :href="data.prev">Previous Month</a> |
                    </span>
                    <a href="#" @click.prevent="aboutDialog">About</a>
                    <span v-if="data.next">
                        | <a :href="data.next">Next Month</a>
                    </span>
                </p>
            </div>
        </footer>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState(['data']),
        appBackground() {
            return `url('${this.$config.siteRoot}default-bg.png') center top no-repeat #1b2838`
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
This page will automatically update as new hardware survey data is available.`,
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

    a {
        color: #C6D4DF;

        &:hover {
            color: #FFF;
        }
    }

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

            nav.tabs ul {
                justify-content: center;
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
                background: transparent;

                .card-header {
                    box-shadow: 0 1px 2px #17435f;
                    background: rgba( 0, 0, 0, 0.4 );
                    position: relative;

                    .card-header-title {
                        color: #c6d4df;
                        justify-content: center;
                    }
                }
                
                .card-content {
                    background: rgba( 0, 0, 0, 0.5 );

                    .content {
                        font-size: 4rem;
                        color: #7092a5;
                    }
                }
            }

            section.stats {
                width: 100%;
                max-width: 800px;
                padding-bottom: 0;

                .select {
                    select {
                        background: rgba( 0, 0, 0, 0.4 );
                        border-color: rgba( 0, 0, 0, 0.5 );
                        color: #c6d4df;
                    }

                    &::after {
                        border-color: rgba(62, 126, 167, 0.8) !important;
                    }
                }

                .table-wrapper {
                    overflow: visible;

                    .table {
                        border-radius: 0;
                        background-color: transparent;

                        thead tr {
                            background: rgba( 0, 0, 0, 0.4 );

                            th {
                                color: #c6d4df;
                                border-color: #2e5b76;
                                user-select: none;

                                &.is-current-sort,
                                &:hover {
                                    border-color: #497b98;
                                }
                            }
                        }

                        tbody tr {
                            background: rgba( 42, 72, 94, 0.2 );
                            border: 1px solid rgba( 0, 0, 0, 0.4 );
                            box-shadow: 1px 1px 7px rgba( 0, 0, 0, 0.3 );

                            td {
                                border: 0;
                                color: #9099a1;
                                
                                &:first-child {
                                    background: rgba( 0, 0, 0, 0.2 );
                                }
                            }
                        }

                        @media screen and (min-width: 769px) {
                            box-shadow: 1px 1px 7px rgba( 0, 0, 0, 0.3 );
                            border: 1px solid rgba( 0, 0, 0, 0.4 );

                            tbody {
                                background: rgba( 0, 0, 0, 0.2 );

                                tr {
                                    border: 0;
                                    box-shadow: none;

                                    &:not(.is-selected):nth-child(even) {
                                        background: rgba( 42, 72, 94, 0.4 );
                                    }

                                    td {
                                        background: transparent !important;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        main + section {
            padding: 0 0 3rem;
            text-align: center;
        }

        footer.footer {
            padding: 3rem 1.5rem;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.5) 100%);
            color: #8F98A0;

            a[href^="h"] {
                display: block;

                @media screen and (min-width: 769px) {
                    display: inline;
                }
            }
        }
    }

    .modal-card {
        border-radius: 6px;

        .modal-card-head,
        .modal-card-foot {
            border: 0;
            background: #171a21;

            p {
                color: #c6d4df;
            }
        }

        .modal-card-body {
            background: #1c2839;
            color: #9099a1;
        }
    }
}
</style>