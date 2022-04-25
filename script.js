(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil & 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function garage() {
        function read() {
            return localStorage.garage ? JSON.parse(localStorage.garage) : [];
        }
        function store(vehicles) {
            return localStorage.setItem("garage", JSON.stringify(vehicles));
        }
        function add(vehicle, save) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
      <td>${vehicle.name}</td>
      <td>${vehicle.plate}</td>
      <td>${vehicle.input}</td>
      <td>
        <button class="delete" data-plate="${vehicle.plate}">X</button>
      </td>
      `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.plate);
            });
            (_b = $("#garage")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (save)
                store([...read(), vehicle]);
        }
        function remove(plate) {
            const car = read().find((vehicle) => vehicle.plate === plate);
            const time = calcTime(new Date().getTime() - new Date(car.input).getTime());
            if (!confirm(`O veículo ${car.name} permaneceu por ${time}. Deseja encerrar?`))
                return;
            store(read().filter((vehicle) => vehicle.plate !== plate));
            render();
        }
        function render() {
            $("#garage").innerHTML = "";
            const garage = read();
            if (garage.length) {
                garage.forEach((vehicle) => add(vehicle));
            }
        }
        return { read, store, remove, add, render };
    }
    garage().render();
    (_a = $("#submit")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $("#plate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !plate) {
            alert("Os campos nome e placa são obrigatórios!");
            return;
        }
        garage().add({ name, plate, input: new Date().toISOString() }, true);
    });
})();
