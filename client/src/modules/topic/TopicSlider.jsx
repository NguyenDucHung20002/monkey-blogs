import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import styled from "styled-components";
import { Link } from "react-router-dom";

const TopicSlider = () => {
  const data = [
    {
      name: "Writing",
      slug: "Writing",
    },
    {
      name: "Relationships",
      slug: "Relationships",
    },
    {
      name: "Machine Learning",
      slug: "Machine",
    },
    {
      name: "Productivity",
      slug: "Productivity",
    },
    {
      name: "Politics",
      slug: "assdasds",
    },
    {
      name: "Crytocurrency",
      slug: "assdasds",
    },
    {
      name: "dasdasd",
      slug: "assdasds",
    },
    {
      name: "dasdasd",
      slug: "assdasds",
    },
    {
      name: "Writing",
      slug: "Writing",
    },
    {
      name: "Relationships",
      slug: "Relationships",
    },
    {
      name: "Machine Learning",
      slug: "Machine",
    },
    {
      name: "Productivity",
      slug: "Productivity",
    },
    {
      name: "Politics",
      slug: "assdasds",
    },
    {
      name: "Crytocurrency",
      slug: "assdasds",
    },
    {
      name: "dasdasd",
      slug: "assdasds",
    },
    {
      name: "dasdasd",
      slug: "assdasds",
    },
  ];

  return (
    <SliderStyle>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
        slidesPerView={"auto"}
        spaceBetween={3}
        autoHeight={true}
      >
        {data.map((val, idx) => (
          <SwiperSlide key={idx}>
            <Link key={idx} to={`/topic/${val.slug}`}>
              {val.name}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderStyle>
  );
};

export default TopicSlider;

const SliderStyle = styled.div`
  .swiper {
    width: 1200px;
    /* height: 30px; */
    padding: 10px;
  }

  .swiper-slide {
    /* max-width: 300px; */
    width: auto;
    background-color: #f2f2f2;
    border-radius: 18px;
    padding: 8px 10px;
    font-size: 14px;
  }
  .swiper-button-next {
    background-color: #ffffff;
    color: black;
    transform: translateX(10px);
  }
  .swiper-button-next::before {
    content: "";
    background-color: #ffffff;
    height: 150%;
    width: 30px;
    position: absolute;
    top: -10px;
    left: -20px;
    filter: blur(4px);
    opacity: 0.95;
    z-index: -1;
    border-radius: 20px;
  }
  .swiper-button-next::after {
    font-size: 10px;
    font-weight: 600;
  }
  .swiper-button-disabled {
    opacity: 0;
  }
  .swiper-button-prev {
    background-color: #ffffff;
    color: black;
    transform: translateX(-10px);
  }
  .swiper-button-prev::before {
    content: "";
    background-color: #ffffff;
    height: 150%;
    width: 30px;
    position: absolute;
    top: -10px;
    right: -20px;
    filter: blur(4px);
    opacity: 0.95;
    z-index: -1;
    border-radius: 20px;
  }
  .swiper-button-prev::after {
    font-size: 10px;
    font-weight: 600;
  }
`;
