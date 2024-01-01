import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Home = () => {
  SwiperCore.use(Navigation);
  return <div>hello world</div>;
};

export default Home;
