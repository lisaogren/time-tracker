import html from 'choo/html'

import './index.scss'

export default () => {
  return html`
    <section class="section welcome-component">
      <div class="container">
        <h1 class="title has-text-centered">
          <span class="icon is-medium">
            <i class="fa fa-rocket"></i>
          </span>
          <span>Bienvenue sur Time Tracker</span>
        </h1>
        <hr>
        <div class="content has-text-centered">
          <p>
            Time Tracker te permet de suivre quotidiennement le temps que tu passes au travail,
            de calculer tes heures supplémentaires, tes congés, tes RTT
          </p>
        </div>
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <span class="icon">
                    <i class="fa fa-clock-o"></i>
                  </span>
                </div>
                <div class="content">
                  Système start/stop simple. Aucune perte de temps
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <span class="icon">
                    <i class="fa fa-area-chart"></i>
                  </span>
                </div>
                <div class="content">
                  Résumé pratique pour rapidement savoir ta situation
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <span class="icon">
                    <i class="fa fa-table"></i>
                  </span>
                </div>
                <div class="content">
                  Détails éditable facile à naviguer pour les plus pointilleux
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}
