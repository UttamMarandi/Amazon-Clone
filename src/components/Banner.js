import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Banner() {
  return (
    <div className="relative banner">
      {/* self closing div for implementing the div */}
      <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      <Carousel
        autoPlay
        infiniteLoops
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div>
          <img
            loading="lazy"
            src="https://raw.githubusercontent.com/UttamMarandi/Amazon-Clone/main/public/amazon_banner_1.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://raw.githubusercontent.com/UttamMarandi/Amazon-Clone/main/public/amazon_banner_2.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://raw.githubusercontent.com/UttamMarandi/Amazon-Clone/main/public/amazon_banner_3.jpg"
            alt=""
          />
        </div>
      </Carousel>
    </div>
  );
}

export default Banner;
