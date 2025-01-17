### Cerințe generale minimale pentru partea 1 (HTML + CSS):

- [X] fișiere separate pentru HTML și CSS  
    *(Fisiere HTML pentru fiecare pagina, fisiere css diferite pentru stiluri diferite.)*
      
- [X] conținutul site-ului trebuie să aibă sens (nu îl umpleți cu Lorem ipsum)  
- [X] nu este acceptată folosirea de frameworkuri și biblioteci 
*(singura biblioteca e in javascript: three.js)*

HTML:
- [X] trecerea testelor de validare HTML http://validator.w3.org/
- [X] folosirea tagurilor semantice prezentate la curs/laborator

CSS:
- [X] trecerea testelor de validare CSS https://jigsaw.w3.org/css-validator/
- [X] site-ul trebuie să fie responsive (media query, unități relative, tipuri de display)  
Media query utilizat in main css, home.css:
```css
@media screen and (max-width: 600px) {
    * {
        overflow: hidden;
        font-size: small;
    }
    /* etc */
}
```
  
Unitati relative:
```css
.slide {
    color: inherit;
    height: 100vh;
    width: 100vw;
    position: relative;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-color: var(--spaceblue);
    display: grid;
}
```
  
- [X] folosirea selectorilor CSS de bază (după id, clasă, tag, elementContinut, elementCopil, al n-lea copil de tipul unui tag :nth-of-type)
- [X] specificarea proprietăților: width, height, color, background, font-size, border, padding, margin, display etc.
- [X] folosirea coloanelor pentru layoutul a cel puțin unei pagini; realizarea layoutului fără tabele (folosind flex și grid)  
*(Exemplu anterior: utilizare grid in formatare slide)*  
  
- [X] site-ul trebuie să conțină un menu drop-down (sau altfel expandabil) realizat cu CSS  
*(Meniu drop-down home page, care devine expandabil pt ecrane mici)*  
  
- [X] site-ul trebuie să conțină o tranziție care implică schimbarea mai multor proprietăți la intervale diferite de timp  
*(Atat asta, cat si celelalte 2 puncte - tratate in sageata de scroll)*  
```css
transition: transform 0.3s linear;
```
- [X] site-ul trebuie să conțină o animație care să modifice mai multe proprietăți ale aceluiași element  
```css
@keyframes alert {
    0% {
        transform: rotate(90deg) translate(0);
    }

    87.5% {
        transform: rotate(90deg) translate(0);
    }

    90% {
        transform: rotate(90deg) translateX(1em);
    }

    92.5% {
        transform: rotate(90deg) translateX(0.5em);
    }

    95% {
        transform: rotate(90deg) translateX(1em);
    }

    100% {
        transform: rotate(90deg) translateX(0);
    }
}
```
- [X] ! bonus point ! pentru generarea conținutului folosind :after, :before (dar să aibă sens; fiți creativi)  
*(Sageata, generata cu before and after)*

### Cerințe generale minimale pentru partea 2 (JavaScript + ajax + misc):
A. JavaScript
- [X] fișier separat pentru codul JavaScript
- [X] modificarea stilului unui element sau al unui grup de elemente  
*(De exemplu, pentru interfata de login in The Constellation Game)* 
```javascript
  loginPopup.style.display = "none";
  gameContainer.style.display = "block";
```  
- [X] manipularea DOM-ului (selectare după id, tag, clasă, folosind selectori CSS)  
*(apare destul de des)*
```javascript
const loginPopup = document.getElementById("loginPopup");
```  
- [ ] crearea și stergerea de elemente HTML  
*(Nu se pune ca element html, dar am lucrat cu obiecte in three.js si nu am avut sansa sa adaug elemente html)*
```javascript
const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
    constellationObjects.push(lineMesh); // mentine linia pentru toggling
    scene.add(lineMesh);
```  
- [X] folosirea și modificarea evenimentelor generate de mouse si tastatură
*(mai multe eventlistener-uri pentur click sau taste: arrowdown, arroup)*
```javascript
document.addEventListener("keydown", function (event) {
  const currentSlide = document
    .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    .closest(".slide");
  if (currentSlide) {
    const currentSlideId = currentSlide.id;
    if (event.key === "ArrowDown") {
      const nextSlideId = getNextSlideId(currentSlideId);
      scrollToSlide(nextSlideId);
    } else if (event.key === "ArrowUp") {
      const previousSlideId = getPreviousSlideId(currentSlideId);
      scrollToSlide(previousSlideId);
    }
  }
});
```  
- [X] modificare de proprietăți
*(un exemplu care imi place: responsiveness in three.js, prin modificare fov)*  
```javascript
if (width < 768) {
    camera.fov = 95;
  } else {
    camera.fov = 60;
  }
```  
- [X] inputuri funcționale (de exemplu: input de tip text/range/number/radio/checkbox, select, textarea)
*(input declinatie si ascensie dreapta pentru modelul de sfera cereasca)*  
- [X] folosirea setTimeout sau setInterval
*(de exemplu, in loading screen pentru planetariu)*  
```javascript
setTimeout(() => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
      loadingScreen.style.display = "none"; // nu mai afisa loading screen
    }, 500);
  }
}, 1000);
```  
- [X] folosirea localStorage (să se pastreze în localStorage o colecție de elemente)
*(mentinerea scor in The Constelation Game)*  
- [X] folosirea a cel puțin unei metode din clasele: Math, Array, String, Date
*(utilizez foarte mult math in calcularea coordonatelor)*  
```javascript
function sphericalToCartesian(ra, dec, radius) {
  const phi = (90 - dec) * (Math.PI / 180);
  const theta = ra * (Math.PI / 180);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}
```  
- [X] schimbarea aleatoare a valorilor unei proprietăți (de exemplu: culoare, dimensiuni, poziție)
*(creez meteoriti random in modelul de planetariu)*  
```javascript
function createMeteor() {
  // genereaza meteorit/stea cazatoare
  const start = new THREE.Vector3(
    Math.random() * radius * 2 - radius,
    Math.random() * radius * 2 - radius,
    Math.random() * radius * 2 - radius
  )
    .normalize()
    .multiplyScalar(radius);

  const end = new THREE.Vector3(
    start.x + Math.random() * 50 - 25,
    start.y + Math.random() * 50 - 25,
    start.z + Math.random() * 50 - 25
  )
    .normalize()
    .multiplyScalar(radius);
    // etc
}
```  
- [X] folosirea proprietăților classList, target sau currentTarget
*(Utilizez, pentru meniul de telefon din homepage, pentru a determina daca click-ul este in meniu sau in afara meniului)*  
```javascript
 document.addEventListener("click", (event) => {
    if (
      !sideMenu.contains(event.target) &&
      !toggleMenuIcon.contains(event.target)
    ) {
      if (!sideMenu.classList.contains("hidden")) {
        sideMenu.classList.add("hidden");
      }
    }
  });
```
- [X]folosirea metodelor getComputedStyle, stopPropagation
*(Pentru click-ul pe o regiune, in The Constellation Game)*  
```javascript
regions.forEach((region) => {
  document.getElementById(region.id).addEventListener("click", (event) => {
    event.stopPropagation(); 
    // etc
  })
})
```  
- [ ] validarea datelor dintr-un formular folosind expresii regulate  
*(Imi pare rau, ma gandeam sa fac un formular de contact/sugestii, dar nu am mai apucat)*  
*(Haven't tackled it, dar asa as fi facut-o)*  

B. AJAX
- [ ] cereri Ajax cu preluare date dintr-un fișier json  
*(Am vrut sa fac, dar nu am reusit cu parcel)*  
- [X] sesiuni: e.g. login/logout (folosind Storage / fișier json)  
*(Login pentru The Constellation Game)*  
- [X] Pe lângă implementarea acestor cerințe minimale (a căror rezolvare corectă nu garantează punctajul maxim), includeți în proiect și tratarea altor probleme (la alegere) precum cea a accesibilității, internaționalizării (traducere, caractere speciale etc.), folosirii canvas/svg etc.  
*(Modelul de sfera cereasca e facut in canvas)*
