import React from 'react';
import './EuropaLeagueInfo.css'; // Import the CSS file
import europ from '../../assets/europ.avif';

const EuropaLeagueInfo = () => {
  return (
    <div className="simple-container">
      <h1>2024/25 UEFA Europa League: Matches, Final, Key Dates</h1>
       <p className='p'>
       What are the match dates? Where is the 2025 final? How will the competition work?
       </p>
       <img className='img'  src={europ} alt="" />
      <p>
        The 2024/25 UEFA Europa League campaign will be the 54th season of this club competition, the 16th since it was rebranded from UEFA Cup to UEFA Europa League, and the first under the new format. It kicks off on 11 July 2024 and runs until the final on 21 May 2025. Please note that dates are subject to change.
      </p>

      <p>
        <strong>What is the new Europa League format?</strong><br />
        The biggest change is to the group stage, which will become a single 36-team League stage. Each side faces eight different teams (four at home, four away). The top eight overall advance directly to the round of 16; sides finishing from ninth to 24th will contest the knockout round play-offs, with the victors going through to the last 16. From then on it is a straight knockout.
      </p>

      <p>
        <strong>When are the 2024/25 Europa League qualifiers?</strong><br />
        First Qualifying Round: 11 & 18 July 2024<br />
        Second Qualifying Round: 25 July & 1 August 2024<br />
        Third Qualifying Round: 8 & 15 August 2024<br />
        Play-offs: 22 & 29 August 2024
      </p>

      <p>
        <strong>When are the 2024/25 Europa League League stage matches?</strong>
        <img className='img' src="https://editorial.uefa.com/resources/0287-1964b9cd3ccc-f31073c775e2-1000/format/wide1/athletic_club_v_cadiz_cf_-_laliga_santander.jpeg?imwidth=2048" alt="" />
        <br />
        Matchday 1: 25/26 September 2024<br />
        Matchday 2: 3 October 2024<br />
        Matchday 3: 24 October 2024<br />
        Matchday 4: 7 November 2024<br />
        Matchday 5: 28 November 2024<br />
        Matchday 6: 12 December 2024<br />
        Matchday 7: 23 January 2025<br />
        Matchday 8: 30 January 2025
      </p>

      <p>
        <strong>When is the 2024/25 Europa League knockout stage?</strong><br />
        Knockout Round Play-offs: 13 & 20 February 2025<br />
        Round of 16: 6 & 13 March 2025<br />
        Quarter-finals: 10 & 17 April 2025<br />
        Semi-finals: 1 & 8 May 2025<br />
        Final: 21 May 2025
      </p>

      <p>
        <strong>When are the 2024/25 Europa League draws?</strong><br />
        First Qualifying Round Draw: 18 June 2024<br />
        Second Qualifying Round Draw: 19 June 2024<br />
        Third Qualifying Round Draw: 22 July 2024<br />
        Play-offs Draw: 5 August 2024<br />
        League Phase Draw: 30 August 2024<br />
        Knockout Round Play-offs Draw: 31 January 2025<br />
        Round of 16, Quarter-finals, Semi-finals Draw: 21 February 2025
      </p>

      <p>
        <strong>Where is the Europa League final in 2025?</strong><br />
        The 2024/25 UEFA Europa League season will conclude at the <strong>Estadio de San Mamés</strong> in Bilbao, Spain, on 21 May 2025.<br /><br />
        With a capacity in excess of 50,000, the home of Athletic Club opened in September 2013 to replace the old San Mamés, which had been home to the club since 1913. The old stadium staged the second leg of the 1977 UEFA Cup final, Athletic beating Juventus 2-1 but still losing the tie on away goals having lost the first leg 1-0, as well as three games at the 1982 FIFA World Cup finals.<br /><br />
        The 2024 UEFA Women's Champions League final will be the new venue's first major international decider.
      </p>

      <p>
        <strong>What do the Europa League winners get?</strong><br />
        The UEFA Europa League trophy is, at 15kg, the heaviest piece of UEFA silverware. To make things extra interesting, it also has no handles.<br /><br />
        The 2024/25 winners likewise gain a place in the League stage of the 2025/26 UEFA Champions League, if they have not qualified via their domestic competition.
      </p>
    </div>
  );
};

export default EuropaLeagueInfo;