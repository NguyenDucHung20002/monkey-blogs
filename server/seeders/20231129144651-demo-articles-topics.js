"use strict";
const { faker } = require("@faker-js/faker");

const toSlug = (string) => {
  if (!string) {
    return "";
  }

  const regex = /[\/\s]+/;
  let slug = string.split(regex);
  slug = slug.join("-").toLowerCase();
  return slug;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = [
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Impact of Artificial Intelligence in Healthcare",
        slug: toSlug("The Impact of Artificial Intelligence in Healthcare"),
        preview:
          "Artificial Intelligence (AI) has emerged as a transformative force in various industries, and its impact on healthcare is nothing short of revolutionary.",
        content:
          "Artificial Intelligence (AI) has emerged as a transformative force in various industries, and its impact on healthcare is nothing short of revolutionary. With the ability to analyze vast amounts of data at incredible speeds, AI is changing the landscape of patient care, diagnostics, and treatment plans.",

        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "Exploring the Future of Quantum Computing",
        slug: toSlug("Exploring the Future of Quantum Computing"),
        preview:
          "Quantum computing is a cutting-edge field that has the potential to revolutionize how we process information and solve complex problems.",
        content:
          "Quantum computing is a cutting-edge field that has the potential to revolutionize how we process information and solve complex problems. Unlike classical computers that use bits, quantum computers use qubits, allowing them to perform calculations at speeds that were once thought impossible.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Impact of Climate Change on Biodiversity",
        slug: toSlug("The Impact of Climate Change on Biodiversity"),
        preview:
          "Climate change is posing a significant threat to biodiversity, leading to shifts in ecosystems and the endangerment of numerous species.",
        content:
          "Climate change is posing a significant threat to biodiversity, leading to shifts in ecosystems and the endangerment of numerous species. Rising temperatures, sea-level changes, and extreme weather events are some of the factors contributing to the loss of habitat and disruption of ecosystems around the world.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Art of Neural Networks in Image Recognition",
        slug: toSlug("The Art of Neural Networks in Image Recognition"),
        preview:
          "Neural networks play a crucial role in the field of image recognition, allowing machines to identify and classify objects with remarkable accuracy.",
        content:
          "Neural networks play a crucial role in the field of image recognition, allowing machines to identify and classify objects with remarkable accuracy. This technology has applications in various domains, from autonomous vehicles to medical imaging, enhancing efficiency and automation in diverse industries.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "Unraveling the Mysteries of Dark Matter",
        slug: toSlug("Unraveling the Mysteries of Dark Matter"),
        preview:
          "Dark matter constitutes a significant portion of the universe, yet its nature remains one of the greatest mysteries in astrophysics.",
        content:
          "Dark matter constitutes a significant portion of the universe, yet its nature remains one of the greatest mysteries in astrophysics. Researchers are employing innovative techniques and advanced telescopes to detect and understand the elusive properties of dark matter, reshaping our understanding of the cosmos.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Evolution of Robotics in Industry 4.0",
        slug: toSlug("The Evolution of Robotics in Industry 4.0"),
        preview:
          "The fourth industrial revolution, Industry 4.0, is characterized by the integration of robotics, automation, and data exchange in manufacturing processes.",
        content:
          "The fourth industrial revolution, Industry 4.0, is characterized by the integration of robotics, automation, and data exchange in manufacturing processes. Robotics plays a central role in enhancing efficiency, precision, and flexibility in production, paving the way for smart factories and advanced manufacturing techniques.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Rich Tapestry of World History",
        slug: toSlug("The Rich Tapestry of World History"),
        preview:
          "World history is a complex tapestry woven with the threads of diverse cultures, civilizations, and events spanning millennia.",
        content:
          "World history is a complex tapestry woven with the threads of diverse cultures, civilizations, and events spanning millennia. Exploring the rise and fall of empires, pivotal battles, cultural exchanges, and revolutions provides a profound understanding of the interconnectedness of human societies throughout the ages.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Intricate Dance of Quantum Entanglement",
        slug: toSlug("The Intricate Dance of Quantum Entanglement"),
        preview:
          "Quantum entanglement, a phenomenon where particles become interconnected and share properties, challenges our classical understanding of physics.",
        content:
          "Quantum entanglement, a phenomenon where particles become interconnected and share properties, challenges our classical understanding of physics. This intriguing aspect of quantum mechanics has been the subject of intense study, with implications for quantum computing, teleportation, and the fundamental nature of reality.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Renaissance: A Cultural Rebirth",
        slug: toSlug("The Renaissance: A Cultural Rebirth"),
        preview:
          "The Renaissance was a period of profound cultural transformation in Europe, marked by a revival of interest in art, literature, and humanism.",
        content:
          "The Renaissance was a period of profound cultural transformation in Europe, marked by a revival of interest in art, literature, and humanism. This cultural rebirth, spanning the 14th to the 17th centuries, laid the foundation for the modern world and ignited a renewed appreciation for creativity, knowledge, and individualism.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Wonders of Artificial Neural Networks",
        slug: toSlug("The Wonders of Artificial Neural Networks"),
        preview:
          "Artificial Neural Networks (ANNs) mimic the structure and function of the human brain, enabling machines to learn from data and make intelligent decisions.",
        content:
          "Artificial Neural Networks (ANNs) mimic the structure and function of the human brain, enabling machines to learn from data and make intelligent decisions. From image and speech recognition to natural language processing, ANNs are at the forefront of artificial intelligence, driving innovation across various domains.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "Journey to the Center of the Earth: Earth's Core Exploration",
        slug: toSlug(
          "Journey to the Center of the Earth: Earth's Core Exploration"
        ),
        preview:
          "Exploring the Earth's core has been a scientific endeavor to unravel the mysteries beneath our feet and understand the dynamics of our planet.",
        content:
          "Exploring the Earth's core has been a scientific endeavor to unravel the mysteries beneath our feet and understand the dynamics of our planet. Through seismic studies, drilling projects, and geophysical investigations, scientists aim to gain insights into the composition, temperature, and behavior of the Earth's innermost layers.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Psychology of Creativity: Unleashing Innovation",
        slug: toSlug("The Psychology of Creativity: Unleashing Innovation"),
        preview:
          "Understanding the psychology of creativity provides insights into how individuals and organizations can foster innovation and unleash their creative potential.",
        content:
          "Understanding the psychology of creativity provides insights into how individuals and organizations can foster innovation and unleash their creative potential. Exploring the cognitive processes, personality traits, and environmental factors that influence creativity sheds light on the mechanisms behind breakthrough ideas and artistic expression.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Enigma of Black Holes: Gateways to the Unknown",
        slug: toSlug("The Enigma of Black Holes: Gateways to the Unknown"),
        preview:
          "Black holes, with their intense gravitational pull, have intrigued scientists and stargazers alike, serving as portals to the mysteries of the cosmos.",
        content:
          "Black holes, with their intense gravitational pull, have intrigued scientists and stargazers alike, serving as portals to the mysteries of the cosmos. Studying black holes unveils the extreme conditions of spacetime, offering insights into the nature of gravity, time dilation, and the boundaries of our understanding of the universe.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Impact of Social Media on Society",
        slug: toSlug("The Impact of Social Media on Society"),
        preview:
          "The advent of social media has transformed the way individuals connect, communicate, and share information, influencing societal dynamics on a global scale.",
        content:
          "The advent of social media has transformed the way individuals connect, communicate, and share information, influencing societal dynamics on a global scale. Examining the positive and negative impacts of social media sheds light on issues related to privacy, online communities, and the dissemination of information in the digital age.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Power of Genetic Engineering in Agriculture",
        slug: toSlug("The Power of Genetic Engineering in Agriculture"),
        preview:
          "Genetic engineering has revolutionized agriculture, enabling scientists to modify crops for improved yields, resistance to pests, and nutritional content.",
        content:
          "Genetic engineering has revolutionized agriculture, enabling scientists to modify crops for improved yields, resistance to pests, and nutritional content. This powerful tool has the potential to address food security challenges, enhance crop resilience, and contribute to sustainable farming practices.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Legacy of Ancient Civilizations: Lessons from the Past",
        slug: toSlug(
          "The Legacy of Ancient Civilizations: Lessons from the Past"
        ),
        preview:
          "The legacy of ancient civilizations, from Mesopotamia to Rome, continues to shape our world, offering valuable lessons in governance, culture, and innovation.",
        content:
          "The legacy of ancient civilizations, from Mesopotamia to Rome, continues to shape our world, offering valuable lessons in governance, culture, and innovation. Exploring the achievements and challenges of these civilizations provides a deeper understanding of the foundations of human society and the factors that contribute to its flourishing or decline.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Quantum Revolution: Harnessing Quantum Mechanics",
        slug: toSlug("The Quantum Revolution: Harnessing Quantum Mechanics"),
        preview:
          "The quantum revolution is underway, with scientists and engineers harnessing the principles of quantum mechanics to create powerful technologies with unprecedented capabilities.",
        content:
          "The quantum revolution is underway, with scientists and engineers harnessing the principles of quantum mechanics to create powerful technologies with unprecedented capabilities. Quantum computers, communication networks, and sensors are at the forefront of this revolution, promising to transform the landscape of information processing and communication.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Artistic Expression of Cultural Diversity",
        slug: toSlug("The Artistic Expression of Cultural Diversity"),
        preview:
          "Cultural diversity is a wellspring of artistic expression, influencing literature, visual arts, music, and other forms of creative output around the globe.",
        content:
          "Cultural diversity is a wellspring of artistic expression, influencing literature, visual arts, music, and other forms of creative output around the globe. Exploring the ways in which different cultures inspire and enrich artistic endeavors highlights the interconnectedness of humanity through the language of creativity.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Marvels of Marine Biology: Exploring Ocean Ecosystems",
        slug: toSlug(
          "The Marvels of Marine Biology: Exploring Ocean Ecosystems"
        ),
        preview:
          "Marine biology delves into the wonders of ocean ecosystems, from the intricate biodiversity of coral reefs to the mysterious depths of the abyssal zone.",
        content:
          "Marine biology delves into the wonders of ocean ecosystems, from the intricate biodiversity of coral reefs to the mysterious depths of the abyssal zone. Understanding the interconnected web of marine life, the impact of climate change on oceans, and the potential for new discoveries in unexplored regions contributes to the conservation and appreciation of Earth's vital water environments.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
      {
        authorId: faker.number.int({ min: 1, max: 15 }),
        title: "The Intersection of Psychology and Artificial Intelligence",
        slug: toSlug(
          "The Intersection of Psychology and Artificial Intelligence"
        ),
        preview:
          "The intersection of psychology and artificial intelligence explores how insights into human cognition and behavior can inform the development of intelligent machines.",
        content:
          "The intersection of psychology and artificial intelligence explores how insights into human cognition and behavior can inform the development of intelligent machines. From emotion recognition to user experience design, the collaboration between these fields holds the potential to create AI systems that understand, adapt, and interact with users in more human-like ways.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "approved",
      },
    ];

    await queryInterface.bulkInsert("articles", articles);

    const data = [];

    for (let i = 0; i < 10; i++) {
      data.push({
        articleId: faker.number.int({ min: 1, max: 15 }),
        topicId: faker.number.int({ min: 1, max: 15 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("articles_topics", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("articles_topics", null, {});
    await queryInterface.bulkDelete("articles", null, {});
  },
};
