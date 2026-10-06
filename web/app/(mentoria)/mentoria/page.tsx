import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MentoriaMotion from "./MentoriaMotion";

export const metadata: Metadata = {
  title: "Call de carreira 1:1 com Rodrigo Scharp",
  description:
    "Uma call de uma hora, 1:1, para quem está entrando em tecnologia ou migrando de carreira. Você entra sem saber qual caminho seguir e sai com um plano escrito do que estudar e em que ordem.",
};

export default function MentoriaPage() {
  return (
    <>
      <div className="loader" aria-hidden="true"><span className="loader__signature">Rodrigo Scharp</span></div>

      <header className="site-header">
        <Link href="/" className="site-logo"><span>Rodrigo</span><span>Scharp</span></Link>
        <div className="site-header__actions">
          <a className="btn-pill" data-cta="header" target="_blank" rel="noopener noreferrer"
             href="https://wa.me/5512996419003?text=Oi%20Rodrigo!%20Quero%20marcar%20uma%20call%20com%20voc%C3%AA.">Marcar uma call ↗</a>
          <button className="menu-btn" id="menu-toggle" aria-label="Abrir menu"><span></span></button>
        </div>
      </header>

      <div className="menu-overlay" id="menu-overlay">
        <button className="menu-overlay__close" id="menu-close" aria-label="Fechar menu">✕</button>
        <nav>
          <a href="#diagnostico">O diagnóstico</a>
          <a href="#formato">Como funciona</a>
          <a href="#oferta">Investimento</a>
          <a href="#faq">Dúvidas</a>
          <Link href="/">Portfólio</Link>
        </nav>
        <div className="menu-overlay__socials">
          <a href="https://www.linkedin.com/in/rodrigo-scharp-8728a7277" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://github.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <main>
        {/* HERO */}
        <section className="section section--olive topo m-hero" id="hero">
          <div className="container">
            <div className="m-hero__grid">
              <div className="m-hero__copy" data-reveal>
                <span className="m-tag reveal-item">Call de carreira 1:1 · uma hora, só sua</span>
                <h1 className="headline">
                  <span className="hl-line">Você não precisa</span>
                  <span className="hl-line">de mais um curso.</span>
                  <span className="hl-line"><em className="hl-serif">Precisa de direção.</em></span>
                </h1>
                <p className="lead reveal-item">Para quem está migrando de carreira ou cursando TI e ainda não sabe qual caminho seguir. Uma hora ao vivo comigo: a gente olha de onde você vem, o que você estuda hoje e pra onde dá pra ir. Você sai com um plano escrito do que estudar primeiro.</p>
                <div className="m-hero__cta reveal-item">
                  <a className="btn-pill btn-pill--lg" data-cta="hero" target="_blank" rel="noopener noreferrer"
                     href="https://wa.me/5512996419003?text=Oi%20Rodrigo!%20Quero%20marcar%20uma%20call%20com%20voc%C3%AA.">Marcar uma call ↗</a>
                  <span className="m-hero__cta-note">4 horários por semana · marcamos direto no WhatsApp</span>
                </div>
              </div>

              <div className="m-hero__photo">
                <span className="m-scrawl">sem turma de 200 pessoas</span>
                <Image src="/images/mentoria/rodrigo-about.jpeg" alt="Rodrigo Scharp" width={1086} height={1448} priority />
              </div>
            </div>

            <ul className="m-facts">
              <li><strong>1h</strong><span>ao vivo, sempre comigo</span></li>
              <li><strong>1:1</strong><span>sua história, seu objetivo, sua call</span></li>
              <li><strong>Plano</strong><span>escrito, depois da call</span></li>
            </ul>
          </div>
        </section>

        {/* PROVA */}
        <section className="section section--cream topo" style={{ paddingBlock: "clamp(2rem, 4vw, 3rem)" }} aria-label="Onde já estive">
          <div className="marquee">
            <div className="marquee__track">
              <span className="marquee__item">TDC São Paulo</span>
              <span className="marquee__item">Web Summit Rio</span>
              <span className="marquee__item">CODECON Summit</span>
              <span className="marquee__item">Debate de IA na Microsoft</span>
              <span className="marquee__item">Fórum de Cidades Digitais</span>
              <span className="marquee__item">Smart Cities</span>
              <span className="marquee__item">C-Level na Prefeitura de Ubatuba</span>
              <span className="marquee__item">Founder da Muno</span>
              <span className="marquee__item">TDC São Paulo</span>
              <span className="marquee__item">Web Summit Rio</span>
              <span className="marquee__item">CODECON Summit</span>
              <span className="marquee__item">Debate de IA na Microsoft</span>
              <span className="marquee__item">Fórum de Cidades Digitais</span>
              <span className="marquee__item">Smart Cities</span>
              <span className="marquee__item">C-Level na Prefeitura de Ubatuba</span>
              <span className="marquee__item">Founder da Muno</span>
            </div>
          </div>
        </section>

        {/* DIAGNÓSTICO */}
        <section className="section section--olive topo" id="diagnostico">
          <div className="container">
            <div className="m-head">
              <span className="label label--lime">O diagnóstico</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Marque as frases</span>
                <span className="hl-line">que são <em className="hl-serif">suas</em>.</span>
              </h2>
            </div>

            <ul className="m-check" data-reveal>
              <li className="reveal-item">
                <svg className="scribble m-check__mark" viewBox="0 0 60 50" aria-hidden="true"><path d="M6 27 C 14 32, 19 39, 23 44 C 30 30, 41 14, 55 5" pathLength="1" /></svg>
                <span>“Estou cursando TI e ainda não sei qual área seguir.”</span>
              </li>
              <li className="reveal-item">
                <svg className="scribble m-check__mark" viewBox="0 0 60 50" aria-hidden="true"><path d="M5 25 C 13 31, 18 38, 22 45 C 29 29, 40 13, 56 4" pathLength="1" /></svg>
                <span>“Quero sair da minha área, mas não sei se dá tempo pra mim.”</span>
              </li>
              <li className="reveal-item">
                <svg className="scribble m-check__mark" viewBox="0 0 60 50" aria-hidden="true"><path d="M7 28 C 14 33, 19 39, 24 45 C 31 31, 42 15, 55 6" pathLength="1" /></svg>
                <span>“Front, back, dados, QA: cada vídeo me diz uma coisa diferente.”</span>
              </li>
              <li className="reveal-item">
                <svg className="scribble m-check__mark" viewBox="0 0 60 50" aria-hidden="true"><path d="M5 26 C 13 32, 18 38, 23 44 C 30 30, 41 14, 56 5" pathLength="1" /></svg>
                <span>“Mando currículo pra vaga júnior e nunca me chamam.”</span>
              </li>
              <li className="reveal-item">
                <svg className="scribble m-check__mark" viewBox="0 0 60 50" aria-hidden="true"><path d="M6 26 C 14 31, 19 38, 23 45 C 30 29, 41 15, 55 4" pathLength="1" /></svg>
                <span>“Tenho medo de estudar seis meses a coisa errada.”</span>
              </li>
            </ul>

            <div className="m-check__kicker">
              <p className="lead">Se duas dessas são suas, o problema não é falta de curso. É não ter ninguém olhando o seu caso e te dizendo por onde começar.</p>
              <span className="m-scrawl m-scrawl--right">eu comecei em 2023, do zero</span>
            </div>
          </div>
        </section>

        {/* TRANSFORMAÇÃO */}
        <section className="section section--olive topo" id="transformacao" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="m-head">
              <span className="label label--lime">A virada</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">De onde você está</span>
                <span className="hl-line">para onde <em className="hl-serif">dá pra ir</em>.</span>
              </h2>
            </div>

            <div className="m-shift" data-reveal>
              <div className="m-shift__col m-shift__col--now reveal-item">
                <h3>Hoje</h3>
                <ul>
                  <li>Estuda no escuro e escolhe caminho por hype de vídeo</li>
                  <li>Curso em cima de curso, e nenhuma vaga</li>
                  <li>Não sabe o que a vaga júnior realmente pede</li>
                  <li>Currículo que esconde tudo que você já sabe fazer</li>
                </ul>
              </div>
              <div className="m-shift__col m-shift__col--next reveal-item">
                <h3>Depois de uma hora</h3>
                <ul>
                  <li>Um caminho escrito, com o que estudar primeiro</li>
                  <li>Sabe qual área encaixa com a sua bagagem</li>
                  <li>Entende o que a vaga júnior de verdade exige</li>
                  <li>Currículo falando a língua de quem contrata</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* QUEM SOU */}
        <section className="section section--cream topo" id="sobre">
          <div className="container">
            <div className="m-head">
              <span className="label">Quem está do outro lado</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Rodrigo <em className="hl-serif">Scharp</em></span>
              </h2>
            </div>

            <div className="m-about" data-reveal>
              <div className="m-about__media reveal-item img-hover">
                <Image src="/images/mentoria/rodrigo-retrato.jpg" alt="Rodrigo Scharp" width={1400} height={801} />
              </div>
              <div className="m-about__body">
                <p className="reveal-item">Em 2023 eu escrevi minha primeira linha de código como profissional. Em menos de três anos passei por consultoria em Java e Spring, fundei a Muno e cheguei a C-Level de Tecnologia e Inovação na Prefeitura de Ubatuba, onde o software erra na frente de uma cidade inteira e por isso não pode errar.</p>
                <p className="reveal-item">Não foi sorte e também não foi talento. Foi escolher direito em cada bifurcação: o que estudar primeiro, o que ignorar, quando parar de assistir aula e começar a construir. A parte cara foi descobrir isso sozinho, porque cada mês estudando a coisa errada é um mês que não volta.</p>
                <p className="reveal-item">Hoje eu vejo o outro lado da mesa: quem é chamado, quem é descartado na triagem e o que realmente pesa nessa decisão. Fui convidado pro TDC São Paulo, pro Web Summit Rio e pro debate de IA na Microsoft, mas o que eu levo pra sua call não é palco. É o mapa que eu queria ter tido quando comecei.</p>
                <ul className="m-about__creds reveal-item">
                  <li>C-Level de Tecnologia e Inovação na Prefeitura de Ubatuba</li>
                  <li>Founder da Muno</li>
                  <li>Convidado no TDC São Paulo, Web Summit Rio e CODECON Summit</li>
                  <li>Formação em IA aplicada pela Anthropic e Google Cloud</li>
                </ul>
                <Link className="btn-pill btn-pill--ghost reveal-item" href="/">Ver o portfólio completo ↗</Link>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="section section--olive topo" id="formato">
          <div className="container">
            <div className="m-head">
              <span className="label label--lime">O formato</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Uma hora,</span>
                <span className="hl-line">quatro <em className="hl-serif">partes</em>.</span>
              </h2>
              <p className="lead">Você manda o seu cenário antes. A hora inteira é sobre a sua carreira, e o plano vem por escrito depois.</p>
            </div>

            <ol className="m-phases" data-reveal>
              <li className="m-phase reveal-item">
                <span className="m-phase__when">Antes<small>CONTEXTO</small></span>
                <div>
                  <h3>Você me manda o seu cenário</h3>
                  <p>Currículo, LinkedIn e algumas linhas sobre a sua situação e o que você procura. Eu leio antes da call, pra não gastar a sua hora te perguntando o óbvio.</p>
                </div>
              </li>
              <li className="m-phase reveal-item">
                <span className="m-phase__when">min 00 a 20<small>DIAGNÓSTICO</small></span>
                <div>
                  <h3>A gente olha onde você está</h3>
                  <p>De onde você vem, o que já estudou e quanto tempo real você tem por semana. Sem fantasia: o que dá pra fazer dentro da sua rotina, não da rotina de ninguém.</p>
                </div>
              </li>
              <li className="m-phase reveal-item">
                <span className="m-phase__when">min 20 a 55<small>DIREÇÃO</small></span>
                <div>
                  <h3>Qual caminho seguir e qual ignorar</h3>
                  <p>Front, back, dados, QA, infra ou produto: qual encaixa com a sua bagagem e com o mercado que você alcança. A gente escolhe um, com motivo.</p>
                </div>
              </li>
              <li className="m-phase reveal-item">
                <span className="m-phase__when">Depois<small>PLANO</small></span>
                <div>
                  <h3>O plano escrito na sua mão</h3>
                  <p>Em até 24 horas você recebe por escrito o que estudar, em que ordem, o que ignorar por enquanto e como o seu currículo deve contar isso. Dá pra executar sozinho a partir dali.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* PILARES */}
        <section className="section section--cream topo" id="pilares">
          <div className="container">
            <div className="m-head">
              <span className="label">O que dá pra abrir na call</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Você escolhe</span>
                <span className="hl-line">o que <em className="hl-serif">te trava</em>.</span>
              </h2>
              <p className="lead">Uma call, um foco. Traga o que mais pesa hoje e a gente vai fundo nele, em vez de passar raso por seis.</p>
            </div>

            <div className="m-pillars" data-reveal>
              <article className="m-pillar reveal-item">
                <h3>Qual caminho é o seu</h3>
                <p>Front, back, dados, QA ou infra: escolher pela sua bagagem, não pelo hype do mês.</p>
              </article>
              <article className="m-pillar reveal-item">
                <h3>O que a vaga júnior pede</h3>
                <p>O que na descrição é obrigatório, o que é enfeite e o que elimina candidato.</p>
              </article>
              <article className="m-pillar reveal-item">
                <h3>A carreira que você já tem</h3>
                <p>Quem vem de outra área chega com vantagem, se souber contar isso direito.</p>
              </article>
              <article className="m-pillar reveal-item">
                <h3>Um plano que cabe na sua semana</h3>
                <p>Ordem, prazo e o que cortar. Estudar menos coisa, na sequência certa.</p>
              </article>
              <article className="m-pillar reveal-item">
                <h3>Projeto vale mais que certificado</h3>
                <p>O que construir pra mostrar, e por que um projeto de verdade supera dez cursos.</p>
              </article>
              <article className="m-pillar reveal-item">
                <h3>Como você é lido</h3>
                <p>Currículo, LinkedIn e a primeira conversa: o que o outro lado realmente avalia.</p>
              </article>
            </div>
          </div>
        </section>

        {/* INCLUSO */}
        <section className="section section--olive topo" id="incluso">
          <div className="container">
            <div className="m-head">
              <span className="label label--lime">O que está incluso</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Tudo que entra</span>
                <span className="hl-line">na <em className="hl-serif">call</em>.</span>
              </h2>
            </div>

            <ul className="m-includes" data-reveal>
              <li className="reveal-item">
                <div>
                  <h3>Uma hora ao vivo, 1:1</h3>
                  <p>Só eu e você, sobre o seu caso. Sem turma, sem aula gravada pra todo mundo.</p>
                </div>
              </li>
              <li className="reveal-item">
                <div>
                  <h3>Leitura prévia do seu material</h3>
                  <p>Currículo, LinkedIn e o seu cenário lidos antes, pra call já começar no ponto.</p>
                </div>
              </li>
              <li className="reveal-item">
                <div>
                  <h3>Plano de carreira escrito</h3>
                  <p>Em até 24 horas: o que estudar, em que ordem e o que ignorar por enquanto.</p>
                </div>
              </li>
              <li className="reveal-item m-includes__bonus">
                <div>
                  <h3>Volta quando precisar</h3>
                  <p>Call avulsa. Sem pacote, sem assinatura, sem fidelidade de três meses.</p>
                </div>
              </li>
            </ul>
            <p className="m-includes__sum">Você paga <strong>uma call por vez</strong> e só volta se fizer sentido pra você.</p>
          </div>
        </section>

        {/* DEPOIMENTOS
             Oculto de propósito. Para publicar: remova o atributo hidden e troque
             os placeholders por depoimentos reais, com nome e resultado verdadeiros.
             Não publique esta seção com texto inventado. */}
        <section className="section section--cream topo" id="depoimentos" hidden>
          <div className="container">
            <div className="m-head">
              <span className="label">Resultados</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Quem já <em className="hl-serif">passou por aqui</em></span>
              </h2>
            </div>
            <div className="m-pillars" data-reveal>
              <figure className="m-pillar reveal-item">
                <blockquote>“[DEPOIMENTO 1: o resultado concreto que a pessoa teve.]”</blockquote>
                <figcaption><strong>[NOME 1]</strong>, [cargo / resultado]</figcaption>
              </figure>
              <figure className="m-pillar reveal-item">
                <blockquote>“[DEPOIMENTO 2]”</blockquote>
                <figcaption><strong>[NOME 2]</strong>, [cargo / resultado]</figcaption>
              </figure>
              <figure className="m-pillar reveal-item">
                <blockquote>“[DEPOIMENTO 3]”</blockquote>
                <figcaption><strong>[NOME 3]</strong>, [cargo / resultado]</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* OFERTA */}
        <section className="section section--cream topo" id="oferta">
          <div className="container">
            <div className="m-head">
              <span className="label">O investimento</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Uma call,</span>
                <span className="hl-line"><em className="hl-serif">uma hora</em>.</span>
              </h2>
            </div>

            <div className="m-offer" data-reveal>
              <div className="m-offer__body reveal-item">
                <h3>Call de carreira 1:1 de 60 minutos</h3>
                <p>Do seu cenário ao caminho escrito, em uma hora.</p>
                <ul className="m-offer__list">
                  <li>Uma hora ao vivo, 1:1, sempre comigo</li>
                  <li>Leitura prévia do currículo e do LinkedIn</li>
                  <li>Plano de carreira escrito em até 24 horas</li>
                  <li>Avulsa: sem pacote e sem assinatura</li>
                </ul>
              </div>
              <div className="m-offer__price reveal-item">
                <span className="m-offer__from">Uma call, uma hora</span>
                <span className="m-offer__amount">R$ 199,99</span>
                <span className="m-offer__terms">à vista no Pix ou no cartão</span>
                <a className="btn-pill" data-cta="oferta" target="_blank" rel="noopener noreferrer"
                   href="https://wa.me/5512996419003?text=Oi%20Rodrigo!%20Quero%20marcar%20minha%20call.">Marcar minha call ↗</a>
                <p className="m-offer__fine">Se nos primeiros 10 minutos você achar que não é pra você, a gente encerra ali e eu devolvo o valor integral.</p>
                <p className="m-offer__fine"><strong>4 horários por semana.</strong> Marcamos direto no WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section--cream topo" id="faq" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="m-head">
              <span className="label">Antes de você perguntar</span>
              <h2 className="headline headline--lg" data-reveal>
                <span className="hl-line">Dúvidas <em className="hl-serif">honestas</em></span>
              </h2>
            </div>

            <div className="m-faq">
              <details>
                <summary>Serve pra quem nunca programou?</summary>
                <p>Serve. Se você está começando um curso de TI, pensando em migrar de área ou já estuda e não sabe qual caminho seguir, a call é exatamente pra isso. Você não precisa levar código nenhum. Precisa levar a sua situação e o seu objetivo.</p>
              </details>
              <details>
                <summary>E se eu já trabalho com programação?</summary>
                <p>Serve, se a sua dúvida for de direção: qual área seguir, como sair do júnior, o que estudar agora. Se o que você quer é revisão profunda do seu código, me chama antes que eu te digo com sinceridade se vale.</p>
              </details>
              <details>
                <summary>É uma call só ou um acompanhamento?</summary>
                <p>Uma call só, de uma hora, avulsa. Não é programa de três meses, não tem contrato e não tem assinatura. Se quiser voltar daqui a um mês, é só marcar de novo.</p>
              </details>
              <details>
                <summary>Preciso preparar alguma coisa?</summary>
                <p>Manda currículo e LinkedIn e me conta em poucas linhas a sua situação e o que você procura. Eu leio antes. Quem chega sem contexto queima os primeiros 15 minutos só me explicando o cenário.</p>
              </details>
              <details>
                <summary>Dá pra resolver alguma coisa em uma hora?</summary>
                <p>Uma hora não te dá uma vaga. Mas tira você da indecisão, que é o que mais custa tempo. A maioria não está travada por falta de curso, e sim por não saber qual dos dez caminhos seguir.</p>
              </details>
              <details>
                <summary>E se você achar que não é hora de migrar?</summary>
                <p>Eu te digo na cara, na própria call. Prefiro que você ouça isso em uma hora do que descubra sozinho depois de dois anos e alguns milhares de reais em curso.</p>
              </details>
              <details>
                <summary>Por que não é só um curso mais barato?</summary>
                <p>Porque curso você provavelmente já tem. O que nenhum curso faz é olhar a sua idade, a sua rotina, a sua cidade e o seu currículo e te dizer qual caminho faz sentido pra você.</p>
              </details>
              <details>
                <summary>Como eu marco?</summary>
                <p>Me chama no WhatsApp e me diz o que te trava. Eu te respondo com sinceridade se a call resolve o seu caso, inclusive quando a resposta for não.</p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section topo m-final" id="cta-final">
          <div className="container">
            <h2 className="headline" data-reveal>
              <span className="hl-line">Daqui a seis meses</span>
              <span className="hl-line">você ainda vai estar</span>
              <span className="hl-line"><em className="hl-serif">no mesmo lugar?</em></span>
            </h2>
            <p className="lead">Uma hora, 1:1, e um plano de carreira escrito no fim. Me chama no WhatsApp que eu te digo se a call resolve o seu caso.</p>
            <a className="btn-pill" data-cta="final" target="_blank" rel="noopener noreferrer"
               href="https://wa.me/5512996419003?text=Oi%20Rodrigo!%20Quero%20marcar%20uma%20call%20com%20voc%C3%AA.">Falar com o Rodrigo ↗</a>
            <span className="m-scrawl">te respondo pessoalmente</span>
          </div>
        </section>
      </main>

      <div className="footer-frame">
        <footer className="site-footer topo">
          <span className="signature">Rodrigo Scharp</span>
          <h2 className="headline site-footer__statement" data-reveal>
            <span className="hl-line">Always <em className="hl-serif">building</em>.</span>
          </h2>

          <div className="site-footer__cols">
            <div>
              <span className="label">A call</span>
              <a href="#diagnostico">O diagnóstico</a>
              <a href="#formato">Como funciona</a>
              <a href="#oferta">Investimento</a>
              <a href="#faq">Dúvidas</a>
            </div>
            <div>
              <span className="label">Onde me achar</span>
              <Link href="/">Portfólio</Link>
              <a href="https://www.linkedin.com/in/rodrigo-scharp-8728a7277" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="mailto:rodrigoscharp@gmail.com">E-mail</a>
            </div>
          </div>

          <div className="site-footer__cta">
            <a className="btn-pill" data-cta="footer" target="_blank" rel="noopener noreferrer"
               href="https://wa.me/5512996419003?text=Oi%20Rodrigo!%20Quero%20marcar%20uma%20call%20com%20voc%C3%AA.">Falar no WhatsApp ↗</a>
          </div>

          <div className="site-footer__legal">
            <span>© 2026 Rodrigo Scharp. Todos os direitos reservados.</span>
            <span>São Paulo, Brasil</span>
          </div>
        </footer>
      </div>

      <div className="m-sticky" id="m-sticky">
        <a className="btn-pill" data-cta="sticky" target="_blank" rel="noopener noreferrer"
           href="https://wa.me/5512996419003?text=Oi%20Rodrigo!%20Quero%20marcar%20uma%20call%20com%20voc%C3%AA.">Marcar uma call ↗</a>
      </div>
      <MentoriaMotion />
    </>
  );
}
