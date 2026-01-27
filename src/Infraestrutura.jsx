import './Infraestrutura.css';

function Infraestrutura() {
  // 5 imagens para infraestrutura
  const imagens = [
    {
      id: 1,
      title: 'Unidade Santarém',
      src: '/img/infraestrutura/filial-santarem.jpg'
    },
    {
      id: 2,
      title: 'Unidade 3❤️',
      src: '/img/infraestrutura/filial-3c.jpg'
    },
    {
      id: 3,
      title: 'Unidade Belém',
      src: '/img/infraestrutura/filial-belem.jpg'
    },
    {
      id: 4,
      title: 'Unidade Novo Progresso',
      src: '/img/infraestrutura/filial-novo-progresso.png'
    },
    {
      id: 5,
      title: 'Unidade Sinop',
      src: '/img/infraestrutura/filial-sinop.webp'
    }
  ];

  // URL do vídeo YouTube (substitua pelo seu)
  const videoId = 'dQw4w9WgXcQ';
  const videoThumb = '/img/imagem-video.png';

  return (
    <section className="infraestrutura">
      {/* Header */}
      <div className="infraestrutura-header">
        <div className="infraestrutura-bg"></div>
        <div className="infraestrutura-noise"></div>
        
        <div className="infraestrutura-header-content">
          <h1>Nossa Infraestrutura</h1>
          <p>Conheça nossas instalações e equipamentos</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="infraestrutura-container">
        {/* Vídeo YouTube */}
        <div className="video-section">
          <h2>Vídeo Institucional</h2>
            <div className="video-card">
              <div className="video-thumb-block">
                <div className="video-thumb">
                  <img src={videoThumb} alt="Imagem do vídeo institucional" loading="lazy" />
                </div>
                <p className="video-lead">Assista ao nosso vídeo institucional e venha fazer sua logística crescer.</p>
              </div>

              <div className="video-content">
                <div className="video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/wYhvOBkS9Ys"
                    title="Vídeo Institucional - União Transportes"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
        </div>

        {/* 5 Imagens lado a lado */}
        <div className="imagens-section">
          <h2>Nossas Instalações</h2>
          <div className="imagens-grid">
            {imagens.map((img) => (
              <div key={img.id} className="imagem-card">
                <img src={img.src} alt={img.title} />
                <h3>{img.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Infraestrutura;
