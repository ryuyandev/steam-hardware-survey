<template>
    <div id="app" v-if="data" :style="{ background: appBackground }">
        <header class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Steam Graphics Cards GTX 1060 or weaker
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
                        Total GTX 1060 or weaker
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
                            {{ props.row.percentage }}%
                        </b-table-column>
                    </template>
                </b-table>
            </section>
        </main>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    GPU usage from <a href="https://store.steampowered.com/hwsurvey/" target="_blank">Steam Hardware Survey</a><br />
                    GPU ranking from <a href="https://www.userbenchmark.com/page/developer" target="_blank">UserBenchmark data files</a><br /><br />
                    <a v-if="olderUrl" :href="olderUrl">Show Older Data</a>
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
        ...mapState(['data', 'olderUrl']),
        appBackground() {
            return `url('${process.env.SITE_ROOT}default-bg.png') center top no-repeat #1b2838;`
        },
        date() {
            const date = new Date(this.data.date)
            return `${date.toLocaleDateString('default', { month: 'long' })} ${date.getFullYear()}`
        }
    }
}
</script>

<style lang="scss">
#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

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

    .is-primary {
        background-color: #171a21;
    }

    header.hero {
        background-color: #171a21;

        .title {
            color: #c6d4df;
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
</style>