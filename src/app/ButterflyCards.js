"use client";

export default function ButterflyCards() {
  return (
    <div className="butterfly-wrapper">
      <h1>World Butterflies</h1>

      <div className="cards">
        {/* Radio inputs to control which card is active */}
        <input type="radio" name="card" id="card-1" defaultChecked />
        <input type="radio" name="card" id="card-2" />
        <input type="radio" name="card" id="card-3" />
        <input type="radio" name="card" id="card-4" />
        <input type="radio" name="card" id="card-5" />
        <input type="radio" name="card" id="card-6" />
        <input type="radio" name="card" id="card-7" />
        <input type="radio" name="card" id="card-8" />

        {/* Circle of butterfly images */}
        <div className="circle-container">
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/morpho.png" alt="morpho" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/88.png" alt="88" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/rajah-brooks-birdwing.png" alt="rajah" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/painted-lady.png" alt="painted lady" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/glasswing.png" alt="Glasswing" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/ulysses.png" alt="Ulysses" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/peacock-2.png" alt="Peacock" /></div>
          <div><img src="https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/butterflies/monarch.png" alt="monarch" /></div>
        </div>

        {/* Card content */}
        <div className="contents">
          <article>
            <h2>Blue Morpho</h2>
            <ul>
              <li><span>Scientific Name:</span> Morpho menelaus</li>
              <li><span>Region:</span> Central and South America</li>
              <li><span>Fact:</span> Its iridescent blue wings can reflect light and confuse predators.</li>
            </ul>
            <div className="buttons">
              <label htmlFor="card-8">&#10094;</label>
              <label htmlFor="card-2">&#10095;</label>
            </div>
          </article>

          <article>
            <h2>88 Butterfly</h2>
            <ul>
              <li><span>Scientific Name:</span> Diaethria anna</li>
              <li><span>Region:</span> Central and South America</li>
              <li><span>Fact:</span> Named for the “88” pattern on its wings.</li>
            </ul>
            <div className="buttons">
              <label htmlFor="card-1">&#10094;</label>
              <label htmlFor="card-3">&#10095;</label>
            </div>
          </article>

          {/* Repeat for cards 3-8 */}
        </div>
      </div>
    </div>
  );
}
