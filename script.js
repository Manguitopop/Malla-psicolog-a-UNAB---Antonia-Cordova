
let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || [];

fetch('malla.json')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById('malla');
    const detalle = document.getElementById('detalle');

    // Crear mapa de ramos para consultar por ID
    const mapaRamos = {};
    data.forEach(bloque => {
      bloque.materias.forEach(m => {
        mapaRamos[m.id] = m;
      });
    });

    function requisitosCompletos(ramo) {
      return !ramo.requisitos || ramo.requisitos.every(req => ramosAprobados.includes(req));
    }

    function renderMalla() {
      contenedor.innerHTML = '';

      data.forEach(bloque => {
        const semestreDiv = document.createElement('div');
        semestreDiv.classList.add('semestre');
        semestreDiv.innerHTML = `<h3>Año ${bloque.año} - Semestre ${bloque.periodo}</h3>`;

        bloque.materias.forEach(materia => {
          const ramoDiv = document.createElement('div');
          ramoDiv.classList.add('ramo');
          ramoDiv.textContent = materia.nombre;

          const aprobado = ramosAprobados.includes(materia.id);
          const desbloqueado = requisitosCompletos(materia);

          if (aprobado) {
            ramoDiv.classList.add('aprobado');
          } else if (desbloqueado) {
            ramoDiv.classList.add('desbloqueado');
            ramoDiv.onclick = () => {
              ramosAprobados.push(materia.id);
              localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
              renderMalla();
            };
          } else {
            ramoDiv.classList.add('bloqueado');
          }

          semestreDiv.appendChild(ramoDiv);
        });

        contenedor.appendChild(semestreDiv);
      });
    }

    renderMalla();
  })
  .catch(err => console.error("Error al cargar el archivo JSON:", err));
