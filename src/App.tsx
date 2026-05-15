import S1_Fundamentals from './sections/S1_Fundamentals';
import S2_Limitations from './sections/S2_Limitations';
import S3_ALS from './sections/S3_ALS';
import S4_Future from './sections/S4_Future';

function App() {
  return (
    <main id="main-content">
      <header>
        <h1>The Armitage-Doll Multistage Model &amp; ALS</h1>
        <p>
          An interactive tutorial on multistage disease theory, its limits, and what ALS teaches us
          about continuous damage.
        </p>
      </header>
      <nav aria-label="Tutorial sections">
        <ol>
          <li><a href="#fundamentals">Fundamentals</a></li>
          <li><a href="#limitations">Limitations</a></li>
          <li><a href="#als">Application to ALS</a></li>
          <li><a href="#future">Future Directions</a></li>
        </ol>
      </nav>

      <S1_Fundamentals />
      <S2_Limitations />
      <S3_ALS />
      <S4_Future />
    </main>
  );
}

export default App;
