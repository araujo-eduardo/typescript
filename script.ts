interface Vehicle {
  name: string;
  plate: string;
  input: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

  function calcTime(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil & 60000) / 1000);

    return `${min}m e ${sec}s`;
  }

  function garage() {
    function read(): Vehicle[] {
      return localStorage.garage ? JSON.parse(localStorage.garage) : [];
    }

    function store(vehicles: Vehicle[]) {
      return localStorage.setItem("garage", JSON.stringify(vehicles));
    }

    function add(vehicle: Vehicle, save?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${vehicle.name}</td>
      <td>${vehicle.plate}</td>
      <td>${vehicle.input}</td>
      <td>
        <button class="delete" data-plate="${vehicle.plate}">X</button>
      </td>
      `;

      row.querySelector(".delete")?.addEventListener("click", function () {
        remove(this.dataset.plate);
      });

      $("#garage")?.appendChild(row);

      if (save) store([...read(), vehicle]);
    }

    function remove(plate: string) {
      const car = read().find((vehicle) => vehicle.plate === plate);

      const time = calcTime(
        new Date().getTime() - new Date(car.input).getTime()
      );

      if (
        !confirm(
          `O veículo ${car.name} permaneceu por ${time}. Deseja encerrar?`
        )
      )
        return;

      store(read().filter((vehicle) => vehicle.plate !== plate));
      render();
    }

    function render() {
      $("#garage")!.innerHTML = "";
      const garage = read();

      if (garage.length) {
        garage.forEach((vehicle) => add(vehicle));
      }
    }

    return { read, store, remove, add, render };
  }

  garage().render();
  $("#submit")?.addEventListener("click", () => {
    const name = $("#name")?.value;
    const plate = $("#plate")?.value;

    if (!name || !plate) {
      alert("Os campos nome e placa são obrigatórios!");
      return;
    }

    garage().add({ name, plate, input: new Date().toISOString() }, true);
  });
})();
