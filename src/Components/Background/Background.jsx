import './Background.css';
import video from '../../assets/video.mp4';
import football from '../../assets/football.jpg';
import football2 from '../../assets/football2.jpg';
import football3 from '../../assets/football3.jpg';

export const Background = ({ playStatus, heroCount }) => {
   if (playStatus) {
      return (
         <video className='background fade-in' autoPlay loop muted>
            <source src={video} type='video/mp4'/>
         </video>
      );
   } else if (heroCount === 0) {
      return <img src={football} className='background fade-in' alt="" />;
   } else if (heroCount === 1) {
      return <img src={football2} className='background fade-in' alt="" />;
   } else if (heroCount === 2) {
      return <img src={football3} className='background fade-in' alt="" />;
   }
};