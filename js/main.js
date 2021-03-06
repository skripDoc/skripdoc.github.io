Scorocode.Init({
	ApplicationID: "3196b2e873234547ad8b06ed636d3538",
	JavaScriptKey: "5e85f685a23e44e6abad95accc1dd2ea",
	MasterKey:     "659d718ff9664f6fafbdb79efc93cb34"
});

var div = document.getElementById("listOfBuildings");
var ul = document.createElement("ul");
div.appendChild(ul);
ul.classList.add("ul-tree");

// Вывод иерархии зданий и комнат. 
var buildings = new Scorocode.Query("buildings");
var fBuild = buildings.find().then((found) => {

	let buildings = found.result;

	for (var i = 0, len = buildings.length; i < len; i++) {
		var li = document.createElement("li");
		var span = document.createElement("span");
		var path = buildings[i];
		span.innerHTML = path.name;
		span.id = path._id;
		li.id = "li"+path._id;
		li.appendChild(span);
		ul.appendChild(li);

		var ul2 = document.createElement("ul");
		for (var j = 0, len2 = path.rooms.length; j < len2; j++) {
			li.appendChild(ul2);
			var li2 = document.createElement("li");
			var span2 = document.createElement("span");
			var path2 = path.rooms[j];
			span2.innerHTML = path2.name;
			span2.id = path2.id;
			li2.id = "li"+path2.id;
			li2.appendChild(span2);
			ul2.appendChild(li2);

			if (path2.children) {
				var ul3 = document.createElement("ul");
				for (var k = 0, len3 = path2.children.length; k < len3; k++) {
					li2.appendChild(ul3);
					var li3 = document.createElement("li");
					var span3 = document.createElement("span");
					var path3 = path2.children[k];
					span3.innerHTML = path3.name;
					span3.id = path3.id;
					li3.id = "li"+path3.id;
					li3.appendChild(span3);
					ul3.appendChild(li3);

					if (path3.children) {
						var ul4 = document.createElement("ul");
						for (var z = 0, len4 = path3.children.length; z < len4; z++) {
							li3.appendChild(ul4);
							var li4 = document.createElement("li");
							var span4 = document.createElement("span");
							var path4 = path3.children[z];
							span4.innerHTML = path4.name;
							span4.id = path4.id;
							li4.id = "li"+path4.id;
							li4.appendChild(span4);
							ul4.appendChild(li4);
						}
					}
				}
			}
		}
	}
return buildings;
});

fBuild.then(function(){

	//Сброс настроек формы
	function resetForm() {
		var formClass = document.querySelector("div.formEq");
		formClass.classList.remove("active");
		formClass.classList.remove("ntActGrp");
		formClass.classList.remove("addEqBtn");
		var frmValue = document.querySelector("form.eqEdit");
		frmValue.reset();
		var dltBatn = document.getElementById("idBtnActn");
		dltBatn.innerHTML = "Сохранить";
		var checkPh = document.querySelector("div.activePh");
		if (checkPh) checkPh.classList.remove("activePh");
	}

	var divR = document.getElementById("listOfEquipment");
	var ulR = document.createElement("ul");
	divR.appendChild(ulR);
	ulR.classList.add("equipment-list");
	var arForEq = document.querySelector("div.arrowForEq");
	arForEq.classList.add("active");

	function addActive() {

		// Добавление класса "active" пунктам, содержащим оборудование
		var listOfBuild = document.getElementById("listOfBuildings");
		var elementsBldSpan = listOfBuild.getElementsByTagName("span");

		for (var i = 0; i < elementsBldSpan.length; i++) {
			var input = elementsBldSpan[i].id;
			var elLi = document.getElementById("li"+input);
			var lstLi = elLi.getElementsByTagName("li");
			if (!lstLi.length) {
				var searchActiveli = elLi.getElementsByClassName("active");
				if (searchActiveli) elLi.classList.remove("active");
			}

			var getItems = new Scorocode.Query("equipment");
			var forSearchActive = getItems.equalTo("room", input)
					.find()
						.then((found) => {
							let equipment = found.result;

							if (equipment.length) {
								var idToli = document.getElementById("li"+equipment[0].room);
								idToli.classList.add("active");
							}
							getItems.reset()
							return equipment;
						})
						.catch((error) => {
							console.log("Что-то пошло не так: \n", error)
						});
		}

		// Поиск дочерних элементов с классом "active"
		// Поиск элементов без дочерних узлов с добавлением класса "edit"
		forSearchActive.then(function(){
			var elementsBldLi = listOfBuild.getElementsByTagName("li");
			for (var i = 0; i < elementsBldLi.length; i++) {
				var input = elementsBldLi[i].id;
				var elemLi = document.getElementById(input);
				var searchActiveLi = elemLi.querySelector("li.active");
				var lastLi = elemLi.getElementsByTagName("li");

				if (searchActiveLi) elemLi.classList.add("active")
					else if (lastLi.length) elemLi.classList.remove("active");

				if (!lastLi.length) elemLi.classList.add("edit");
			}
		});
	}
	addActive();

	// Поиск и отображение оборудования по выбранному объекту
	document.getElementById("listOfBuildings").addEventListener("click", searchFunc);
	function searchFunc(e) {
		resetForm();
		if (typeof (e) === "object") e = e.target.id;
		var idRoom = "li"+e;
		var idSpan = e;
		var spanToActive = document.getElementById(idSpan);
		var beforeActiveSpan = document.querySelector("span.active");
		if (beforeActiveSpan) beforeActiveSpan.classList.remove("active");
		var idRm = document.getElementById(idRoom);
		if (spanToActive) spanToActive.classList.add("active");
		ulR.innerHTML = "";

		if (idRm) {
			arForEq.classList.remove("active");
			var searchEdit = idRm.classList.contains("edit");
			var elementsRmSpan = idRm.getElementsByTagName("span");

			for (var i = 0; i < elementsRmSpan.length; i++) {
			var input = elementsRmSpan[i].id;

			var getItems = new Scorocode.Query("equipment");
			getItems.equalTo("room", input)
					.find()
						.then((found) => {
							let equipment = found.result;

							if (equipment.length) {
								for (var q =0, leng = equipment.length; q < leng; q++) {
									var liR = document.createElement("li");
									var spanEq = document.createElement("span");
									var spanCnt = document.createElement("span");
									liR.id = equipment[q]._id;
									spanEq.innerHTML = equipment[q].name;
									spanCnt.innerHTML = equipment[q].count;
									spanEq.className = "spnEqName";
									spanCnt.className = "spnCount";
									spanCnt.classList.add("arrow");
									if (searchEdit) {
										liR.classList.add("edit");
										var iconEdt = document.createElement("i");
										var iconDlt = document.createElement("i");
										iconEdt.id = "Edt"+equipment[q]._id;
										iconDlt.id = "Dlt"+equipment[q]._id;

										iconEdt.classList.add("fa", "fa-pencil", equipment[q].room);
										iconDlt.classList.add("fa", "fa-trash-o", equipment[q].room);
										liR.appendChild(iconDlt);
										liR.appendChild(iconEdt);
									}
									liR.appendChild(spanCnt);
									liR.appendChild(spanEq);
									ulR.appendChild(liR);
								}
							} else if (searchEdit) {
								var liR = document.createElement("li");
								liR.innerHTML = "<em>Нет оборудования</em>";
								liR.classList.add("noEq");
								ulR.appendChild(liR);
							}
							if (searchEdit) {
								var liR = document.createElement("li");
								var iconAdd = document.createElement("i");
								liR.id = "lba"+input;
								iconAdd.id = "icn"+input;
								liR.classList.add("edit", "addEq");
								iconAdd.classList.add("fa", "addEq", "fa-plus");
								liR.appendChild(iconAdd);
								ulR.appendChild(liR);
							}
							getItems.reset()
						})
						.catch((error) => {
							console.log("Что-то пошло не так: \n", error)
						});
			}
		} else arForEq.classList.add("active");
	};

	//Отображение формы
	document.querySelector("ul.equipment-list").addEventListener("click", function(e) {
		document.getElementById('idBtnCncl').onclick = function () {resetForm();}
		resetForm();
		var idEq = e.target.id.slice(3);
		var classBtn = e.target.classList[1];
		var classIdRm = e.target.classList[2];

		if (idEq&&classBtn) {
			switch (classBtn) {

				//Редактирование
				case "fa-pencil":
					var formClass = document.querySelector("div.formEq");
					var spnEqValue = document.getElementById(idEq).getElementsByTagName("span");
					var frmValue = document.querySelector("form.eqEdit");
					frmValue.name.value = spnEqValue[1].innerHTML;
					frmValue.count.value = Number(spnEqValue[0].innerHTML);
					formClass.classList.add("active");

					document.getElementById('editFrm').onsubmit = function() {
						var frmNmVl = frmValue.name.value;
						var frmCntVl = Number(frmValue.count.value);

						if (frmNmVl&&frmCntVl) {
							let equip = new Scorocode.Object("equipment");
							equip.set("_id", idEq).set("name", frmNmVl).set("count", frmCntVl);
							equip.save().then(() => {
								console.info("done");
								searchFunc(classIdRm);
							})
							.catch((error) => {
								console.log(error);
								searchFunc(idEq);
							});
						} else {
							document.querySelector("div.groups").classList.add("activePh");
						}
						return false;
					}
					break;

				//Удаление
				case "fa-trash-o":
					var formClass = document.querySelector("div.formEq");
					var dltBatn = document.getElementById("idBtnActn");
					dltBatn.innerHTML = "Удалить";
					formClass.classList.add("ntActGrp");
					formClass.classList.add("active");

					document.getElementById('idBtnActn').onclick = function() {

						let equip = new Scorocode.Object("equipment");
						equip.getById(idEq).then((item) => {
							equip.remove(item).then(() => {
							console.info("Done");
							searchFunc(classIdRm);
							})
							.catch((error) => {
							console.log(error);
							searchFunc(idEq);
							});
						})
						.catch((error) => {
							console.log(error);
							searchFunc(idEq);
						});
					}
					break;

				//Добавление
				case "addEq":
					var formClass = document.querySelector("div.formEq");
					var frmValue = document.querySelector("form.eqEdit");
					var dltBatn = document.getElementById("idBtnActn");
					dltBatn.innerHTML = "Добавить";
					formClass.classList.add("addEqBtn");
					formClass.classList.add("active");

					document.getElementById('editFrm').onsubmit = function() {
						var frmNmVl = frmValue.name.value;
						var frmCntVl = Number(frmValue.count.value);

						if (frmNmVl&&frmCntVl) {
							let comp = new Scorocode.Object("equipment");
							comp.set("name", frmNmVl);
							comp.set("room", idEq);
							comp.set("count", frmCntVl);
							comp.save().then(() => {
								console.info("Done");
								searchFunc(idEq);
							})
							.catch((error) => {
								console.log(error);
								searchFunc(idEq);
							});
						} else {
							document.querySelector("div.groups").classList.add("activePh");
						}
						return false;
					}
					break;
			}
		}
	});
});



