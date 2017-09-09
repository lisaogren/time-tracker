import html from 'choo/html'

import './index.scss'

export default () => {
  return html`
    <section class="section welcome-component">
      <div class="container">
        <h1 class="title has-text-centered">Bienvenue sur Time Tracker !</h1>
        <hr>
        <div class="content has-text-centered">
          <p>
            Time Tracker te permet de suivre quotidiennement le temps que tu passes au travail,
            de calculer tes heures supplémentaires, tes congés, tes RTT.
          </p>
          <p>
            Ne stresses plus à l'idée de ne pas savoir si tu as rempli les heures requises par ton contrat.
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus nec iaculis mauris. <a>@bulmaio</a>.<br>
                  <a href="#">#css</a> <a href="#">#responsive</a>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus nec iaculis mauris. <a>@bulmaio</a>.<br>
                  <a href="#">#css</a> <a href="#">#responsive</a>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus nec iaculis mauris. <a>@bulmaio</a>.<br>
                  <a href="#">#css</a> <a href="#">#responsive</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}
