"use strict";

(function() {
  let header = document.getElementsByClassName("page-header")[0];
  header.addEventListener("click", toggleNav, false);
  window.addEventListener("resize", toggleNav, false);

  function toggleNav(evt) {
    let nav = header.getElementsByClassName("page-header__navigation")[0];
    let isNavOpened = nav.classList.contains("page-header__navigation--opened");

    if (window.innerWidth >= 1170 && isNavOpened) closeNav();

    let btnOpen = header.getElementsByClassName("page-header__open")[0];
    let btnClose = header.getElementsByClassName("page-header__close")[0];

    if (evt.target === btnOpen && !isNavOpened) openNav();
    if (evt.target === btnClose && isNavOpened) closeNav();

    function openNav() {
      nav.classList.add("page-header__navigation--opened");

      createShading(closeNav);
    };

    function closeNav() {
      nav.classList.remove("page-header__navigation--opened");

      removeShading();
    };
  };

  function createShading(func) {
    let div = document.createElement("div");
    div.classList.add("shading");
    document.body.appendChild(div);
    div.addEventListener("click", func, false);

    document.body.onkeydown = function (evt) {
      if (evt.keyCode !== 27) return;

      func();
      document.body.onkeydown = null;
    };
  };

  function removeShading() {
    document.body.removeChild(document.getElementsByClassName("shading")[0]);
  };

  let modalBtn = document.querySelectorAll("*[data-modal");
  for (let i = 0; i < modalBtn.length; i++) {
    modalBtn[i].addEventListener("click", showModal, false);
  };

  function showModal(evt) {
    evt.preventDefault();

    let modalRequest = document.getElementsByClassName("modal-request")[0];
    modalRequest.style.display = "block";
    modalRequest.querySelector(".consult-request")[0].focus();
    modalRequest.querySelector(".button--close").addEventListener("click", closeModal, false);

    createShading(closeModal);
  };

  function closeModal() {
    let modalRequest = document.getElementsByClassName("modal-request")[0];
    modalRequest.style.display = "none";

    removeShading();
  };

  let downBtn = document.getElementsByClassName("start-home__down")[0];
  downBtn.addEventListener("click", function() {window.scrollBy(0, document.body.scrollHeight - window.innerHeight - window.pageYOffset)}, false)

  let switchPanel = document.getElementsByClassName("switch")[0];
  switchPanel.addEventListener("change", scrollSwitch, true);

  let indicator = document.getElementsByClassName("switch__indicator")[0];
  indicator.addEventListener("click", toggleIndicator, false);

  let section = document.querySelectorAll("section[aria-labelledby]:not(.services)");
  let subsection = document.querySelectorAll("li.services__main-item");
  let prevSect;
  let prevEl;

  document.addEventListener("scroll", getCoords, false);

  function getCoords() {
    if (header.getBoundingClientRect().bottom >= 10) {
      scrollSwitch("header");
      return;
    };

    if (section[0].getBoundingClientRect().bottom >= 10) {
      scrollSwitch(section[0].id);
      return;
    };

    for (let i = 0; i < subsection.length; i++) {
      if (subsection[i].getBoundingClientRect().bottom >= 10) {
        scrollSwitch("services"+ (i + 1));
        return;
      };
    };

    for (let i = 1; i < section.length; i++) {
      if (i == section.length - 2 && section[section.length - 1].getBoundingClientRect().top <= window.outerHeight / 2) {
        scrollSwitch(section[section.length - 1].id);
        return;
      };

      if (section[i].getBoundingClientRect().bottom >= 10) {
        scrollSwitch(section[i].id);
        return;
      };
    };
  };

  function scrollSwitch(evt) {
    let switchEl = evt;
    let subs = evt;

    if (prevSect && prevSect === evt) return;
    prevSect = evt;

    if (evt.target && evt.target.nodeName === "INPUT") {
      document.removeEventListener("scroll", getCoords, false);

      switchEl = evt.target.id.substring(14);
      subs = subsection[+evt.target.id.substr(-1, 1) - 1];
    };

    switch (switchEl) {
      case "header":
        goToElem(header)
        break;
      case "about-us":
        goToElem(section[0])
        break;
      case "services1":
      case "services2":
      case "services3":
        goToElem(subs, true)
        break;
      case "reviews":
        goToElem(section[1])
        break;
      case "questions":
        goToElem(section[2])
        break;
      case "contacts":
        goToElem(section[3])
        break;
    };

    function goToElem(elem, isServices) {
      if (evt.target) {
        elem.scrollIntoView();
      } else {
        let currentBtn = document.getElementById("switchButton__" + evt);
        currentBtn.checked = true;
      };

      toggleIndicator(isServices);
      setTimeout(function () {document.addEventListener("scroll", getCoords, false)}, 100);
    };
  };

  function toggleIndicator(isServicesButton) {
    let isChecked = indicator.classList.contains("switch__indicator--checked");
    let checkedBtn = document.querySelector(".switch__button:checked");

    if (isServicesButton && checkedBtn) checkedBtn.checked = false;

    if (isServicesButton && isServicesButton.target) {
      let servicesFirstBtn = document.getElementById("switchButton__services1");
      servicesFirstBtn.focus();
      servicesFirstBtn.checked = true;
      document.getElementsByClassName("services")[0].scrollIntoView();
    };

    if (isServicesButton && !isChecked) indicator.classList.add("switch__indicator--checked");
    if (!isServicesButton && isChecked) indicator.classList.remove("switch__indicator--checked");
  };

  document.addEventListener("focus", correctTabulation, true);

  function correctTabulation(evt) {
    if (prevEl && prevEl.name !== "switchButton" && evt.target.name === "switchButton" || (evt.target.classList && evt.target.classList.contains("switch__indicator"))) {
      document.onkeydown = function (event) {
        if (event.keyCode !== 9) return;

        prevEl.focus();
        document.onkeydown = null;
      };

    } else {
      if (evt.target.nodeName !== "#document" && evt.target !== document.body && evt.target !== document.documentElement) prevEl = evt.target;
    };
  };

  let slider = document.getElementsByClassName("slider");
  let isMoving;
  for (let i = 0; i < slider.length; i++) {
    slider[i].addEventListener("click", toggleSlider, false);
  };

  function toggleSlider(evt) {
    if (!evt.target.classList.contains("slider__button")) return;

    let isServicesSlider = /services/.test(evt.target.id);
    let isNext = /next/.test(evt.target.id);
    let sliderType = isServicesSlider ? "services" : "reviews";
    let activeEl = document.querySelector("." + sliderType + "__slider .slider__item--active");
    isNext ? changeSlide(activeEl.nextElementSibling) : changeSlide(document.querySelector("." + sliderType + "__slider .slider__item:last-child"));

    function changeSlide(newEl) {
      if (isMoving) return;

      let sliderList = newEl.parentElement;

      activeEl.classList.remove("slider__item--active");
      newEl.classList.add("slider__item--active");

      if (isServicesSlider) {
        isNext ? nextSlide() : prevSlide();
      } else {
        let minus = isNext ? "-" : "";
        animateSlide(function(timePassed, changeLeft) {sliderList.style.left = minus + (timePassed / 500 * changeLeft) + "%"}, 500);
      };

      function nextSlide() {
        sliderList.removeChild(activeEl);
        sliderList.appendChild(activeEl);
      };

      function prevSlide() {
        sliderList.removeChild(newEl);
        sliderList.insertBefore(newEl, sliderList.children[0]);
      };

      function animateSlide(draw, duration) {
        let start = performance.now();
        const mobileLeft = 180;
        const tabletLeft = 110;
        const desktopLeft = 103;

        let isMobile = window.innerWidth < 750;
        let isTablet = !isMobile && window.innerWidth < 1170;
        let isDesktop = !isMobile && !isTablet;

        let changeLeft;
        if (isMobile) changeLeft = mobileLeft;
        if (isTablet) changeLeft = tabletLeft;
        if (isDesktop) changeLeft = desktopLeft;

        requestAnimationFrame(function animate(time) {
          isMoving = true;
          let timePassed = time - start;
          if (timePassed > duration) timePassed = duration;
          if (timePassed < 0) timePassed = 0;

          draw(timePassed, changeLeft);

          if (timePassed < duration) {
            requestAnimationFrame(animate);
          } else {
            isMoving = false;
            sliderList.style.left = null;
            isNext ? nextSlide() : prevSlide();
          };
        });
      };
    };
  };
})();
