const siteData = {
  roadmapItems: [
    {
      key: "foundation",
      stage: "Stage 01",
      title: "基础认知",
      description: "建立 AI、AGI、编程与问题建模的基础视角，形成后续深入学习的共同语言。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/01_AGI%E5%85%A5%E9%97%A8%E5%9F%BA%E7%A1%80",
      linkLabel: "查看模块",
      tags: ["AI 入门", "预备知识", "问题意识"]
    },
    {
      key: "ml",
      stage: "Stage 02",
      title: "机器学习",
      description: "从数据、特征、优化与学习范式出发，补足理解大模型之前的统计学习与训练直觉。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/blob/master/README.md",
      linkLabel: "查看路线",
      tags: ["监督学习", "优化", "训练直觉"]
    },
    {
      key: "dl",
      stage: "Stage 03",
      title: "深度学习",
      description: "通过视觉检测与从零实现模型项目，进入网络结构、训练循环与工程实现层面的真实语境。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/01_AGI%E5%85%A5%E9%97%A8%E5%9F%BA%E7%A1%80/%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%A7%86%E8%A7%89/YOLO%E7%B3%BB%E5%88%97",
      linkLabel: "查看模块",
      tags: ["YOLO", "PyTorch", "训练循环"]
    },
    {
      key: "llm",
      stage: "Stage 04",
      title: "大语言模型",
      description: "围绕 Transformer、位置编码、RLHF 与从零训练 demo，深入理解 LLM 的核心机制。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/02_LLM%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8",
      linkLabel: "查看模块",
      tags: ["Transformer", "RLHF", "Position Encoding"]
    },
    {
      key: "multimodal",
      stage: "Stage 05",
      title: "多模态",
      description: "把文本、图像、视频放进统一视野中，理解感知、对齐与跨模态生成的核心逻辑。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/03_%E5%A4%9A%E6%A8%A1%E6%80%81%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8",
      linkLabel: "查看模块",
      tags: ["MLLM", "图像理解", "视频生成"]
    },
    {
      key: "agent",
      stage: "Stage 06",
      title: "Agent / RAG / MCP",
      description: "从检索增强到工具调用与多智能体协作，进入 AI 系统真正开始具备行动性的阶段。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/07_Agent-RAG-MCP",
      linkLabel: "查看模块",
      tags: ["Agent", "RAG", "MCP"]
    },
    {
      key: "systems",
      stage: "Stage 07",
      title: "系统部署",
      description: "关注推理部署、架构拆分、并行策略与工程可用性，让模型从 demo 走向真实系统。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/09_%E5%A4%A7%E6%A8%A1%E5%9E%8B%E9%83%A8%E7%BD%B2%E7%B3%BB%E5%88%97",
      linkLabel: "查看模块",
      tags: ["推理部署", "并行策略", "系统工程"]
    },
    {
      key: "agi",
      stage: "Stage 08",
      title: "AGI / 具身智能",
      description: "从更高层认知与物理世界交互的角度，理解智能体、环境与任务之间的长期演化关系。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/08_%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD",
      linkLabel: "查看模块",
      tags: ["AGI 认知", "Embodied AI", "长期主义"]
    }
  ],
  projectItems: [
    {
      key: "transformer",
      title: "From-Zero-to-Transformer",
      description: "基于 PyTorch 的从零训练示例，覆盖 Transformer 结构理解、训练循环、样本数据与生成过程。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/blob/master/10_%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/From-Zero-to-Transformer/README.md",
      linkLabel: "查看项目",
      tags: ["PyTorch", "51M Demo", "LLM Training"]
    },
    {
      key: "t2v",
      title: "From-Zero-to-small-T2V",
      description: "围绕文生视频的轻量实验，聚焦 GAN 架构、数据生成逻辑与视频生成路径的工程化理解。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/blob/master/10_%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/From-Zero-to-small-T2V/README.md",
      linkLabel: "查看项目",
      tags: ["GAN", "Text-to-Video", "Synthetic Data"]
    },
    {
      key: "openclaw",
      title: "From-Zero-to-OpenClaw",
      description: "结合 Docker、启动配置与系统集成，体现面向机器人控制与具身方向的工程实践取向。",
      link: "https://github.com/AI-mzq/From-Zero-to-AGI/tree/master/10_%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/From-Zero-to-OpenClaw",
      linkLabel: "查看项目",
      tags: ["Docker", "Embodied", "System Integration"]
    }
  ],
  socialLinks: [
    {
      key: "github",
      label: "GitHub",
      url: "https://github.com/AI-mzq/From-Zero-to-AGI",
      regions: ["about", "footer"]
    },
    {
      key: "knowledge",
      label: "飞书知识库",
      url: "https://oizxc9sdhbc.feishu.cn/wiki/FGS5wST0Hiy6xJklyPTcTVOqnAd?from=from_copylink",
      regions: ["about", "footer"]
    },
    {
      key: "csdn",
      label: "CSDN",
      url: "https://blog.csdn.net/m_aigc2022?type=blog",
      regions: ["about"]
    },
    {
      key: "zhihu",
      label: "知乎",
      url: "https://zhihu.com/people/m_aigc2022",
      regions: ["about"]
    },
    {
      key: "wechat",
      label: "公众号文章",
      url: "https://mp.weixin.qq.com/s/IGLL6_YI9BUeR2KD_Gfx_Q",
      regions: ["footer"]
    }
  ]
};

const syncCardContent = (items, selector, keyAttribute) => {
  items.forEach((item) => {
    const card = document.querySelector(`${selector}[${keyAttribute}="${item.key}"]`);

    if (!card) {
      return;
    }

    const stage = card.querySelector('[data-field="stage"]');
    const title = card.querySelector('[data-field="title"]');
    const description = card.querySelector('[data-field="description"]');
    const tagContainer = card.querySelector('[data-field="tags"]');
    const link = card.querySelector('[data-field="link"]');

    if (stage && item.stage) {
      stage.textContent = item.stage;
    }

    if (title) {
      title.textContent = item.title;
    }

    if (description) {
      description.textContent = item.description;
    }

    if (tagContainer && Array.isArray(item.tags)) {
      tagContainer.innerHTML = item.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");
    }

    if (link) {
      link.href = item.link;
      link.textContent = item.linkLabel;
      link.setAttribute("aria-label", `${item.linkLabel}：${item.title}`);
    }
  });
};

const syncSocialLinks = () => {
  const socialMap = new Map(siteData.socialLinks.map((item) => [item.key, item]));

  document.querySelectorAll("[data-social-region]").forEach((regionNode) => {
    const region = regionNode.getAttribute("data-social-region");

    regionNode.querySelectorAll("[data-social-key]").forEach((link) => {
      const item = socialMap.get(link.getAttribute("data-social-key"));

      if (!item || !item.regions.includes(region)) {
        link.hidden = true;
        return;
      }

      link.hidden = false;
      link.href = item.url;
      link.textContent = item.label;
      link.setAttribute("aria-label", item.label);
    });
  });
};

const syncCounters = () => {
  document.querySelectorAll("[data-roadmap-count]").forEach((node) => {
    node.textContent = String(siteData.roadmapItems.length);
  });

  document.querySelectorAll("[data-project-count]").forEach((node) => {
    node.textContent = String(siteData.projectItems.length);
  });

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
};

const setupMenu = () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!header || !toggle || !nav) {
    return;
  }

  const closeMenu = () => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开导航");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    header.classList.toggle("menu-open", !isOpen);
    toggle.setAttribute("aria-label", !isOpen ? "关闭导航" : "打开导航");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
};

const setupScrollState = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
};

const setupReveal = () => {
  const nodes = document.querySelectorAll("[data-reveal]");

  if (!nodes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  nodes.forEach((node) => observer.observe(node));
};

const setupActiveNav = () => {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll("[data-nav-link]");

  if (!sections.length || !links.length || !("IntersectionObserver" in window)) {
    return;
  }

  const linkMap = new Map(
    Array.from(links).map((link) => [link.getAttribute("href"), link])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const href = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        });

        const activeLink = linkMap.get(href);
        if (activeLink) {
          activeLink.classList.add("is-active");
          activeLink.setAttribute("aria-current", "true");
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -45% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
};

const setupLightbox = () => {
  const triggers = document.querySelectorAll("[data-lightbox-target]");

  if (!triggers.length) {
    return;
  }

  let activeLightbox = null;
  let lastTrigger = null;

  const closeLightbox = () => {
    if (!activeLightbox) {
      return;
    }

    activeLightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lastTrigger?.focus();
    activeLightbox = null;
  };

  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute("data-lightbox-target");
    const lightbox = document.getElementById(targetId);

    if (!lightbox) {
      return;
    }

    const closeNodes = lightbox.querySelectorAll("[data-lightbox-close]");
    const closeButton = lightbox.querySelector(".lightbox-close");

    trigger.addEventListener("click", () => {
      lastTrigger = trigger;
      activeLightbox = lightbox;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton?.focus();
    });

    closeNodes.forEach((node) => {
      node.addEventListener("click", closeLightbox);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
};

syncCardContent(siteData.roadmapItems, "[data-roadmap-key]", "data-roadmap-key");
syncCardContent(siteData.projectItems, "[data-project-key]", "data-project-key");
syncSocialLinks();
syncCounters();
setupMenu();
setupScrollState();
setupReveal();
setupActiveNav();
setupLightbox();
