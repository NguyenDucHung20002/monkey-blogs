import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TopicSlider = ({slug}) => {
  const [activeSlide, setActiveSlide] = useState(-1);
  const handleClick = (index) => {
    setActiveSlide(index);
  };

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
      slug: "Politics",
    },
    {
      name: "Crytocurrency",
      slug: "Crytocurrency",
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
  useEffect(() => {
    // Tìm index của phần tử có tham số URL trùng với slug
    const index = data.findIndex((item) => item.slug === slug);
    setActiveSlide(index);
  }, [slug, data]);
  return (
    <SliderStyle>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        slidesPerView={"auto"}
        spaceBetween={3}
        autoHeight={true}
      >
        <SwiperSlide>
          <div className="flex items-center">
            <Link className={`${activeSlide === -1 ? 'active' : '' }`} onClick={() => handleClick('Explore-topics')} to={`/topic/Explore-topics`}>
              <svg className="mr-1" viewBox="0 0 24 24" fill="none" height="24" width="24"><circle cx="12" cy="12" r="10" stroke="currentColor"></circle><path fillRule="evenodd" clipRule="evenodd" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm3.94-14.84l.14-1-.88.48-5.9 3.2-.22.12-.03.24-.99 6.64-.14.99.88-.48 5.9-3.2.22-.11.03-.25.99-6.63zM9.2 16l.72-4.85 3.59 2.51L9.2 16zm1.3-5.67l3.58 2.51L14.8 8l-4.3 2.33z" fill="currentColor"></path></svg>
               Explore topics
            </Link>
          </div>
        </SwiperSlide>
        {data.map((val, idx) => (
          <SwiperSlide key={idx}>
            <Link className={`${idx === activeSlide ? 'active' : '' }`} key={idx} to={`/topic/${val.slug}`} onClick={() => handleClick(idx)} >
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
    max-width: 1200px;
    padding: 10px;
  }

  .swiper-slide {
    width: auto;
    background-color: #f2f2f2;
    border-radius: 18px;
  }
  .active {
    border: 1px solid black; 
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
  a{
    display: flex;
    padding: 10px  10px 8px;
    font-size: 14px;
    align-items: center;
    border-radius: 18px;
    max-height: 38px;
  }
`;
