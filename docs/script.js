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
  ],
  knowledgePlanet: {
    title: "AI 前沿精选 · 知识星球",
    subtitle: "2026 年 Q1 · 内容精华汇总",
    intro: "汇聚全球最前沿的 AI 技术动态、深度行业研报与实战落地方法，筛选近期最具价值的核心内容，帮助学习者、开发者与研究者更快建立判断、方案与执行路径。",
    stats: [
      { value: "10 条", label: "精选内容", tone: "green" },
      { value: "4 大主题", label: "内容覆盖", tone: "blue" },
      { value: "2026-03-30", label: "最新整理", tone: "orange" }
    ],
    tags: [
      { label: "AI Agent 演进", tone: "green" },
      { label: "多模态实战", tone: "blue" },
      { label: "学术前沿", tone: "orange" },
      { label: "大模型应用", tone: "violet" }
    ],
    themes: [
      {
        key: "agent",
        tone: "green",
        icon: "AG",
        title: "AI Agent 进化论",
        description: "聚焦 Agent 核心技术突破与产业趋势，梳理从能力边界到商业化判断的关键线索。",
        items: [
          {
            title: "LLM/Agent 模型跨过临界点的迷茫期",
            titleHighlights: [{ text: "临界点", tone: "green" }],
            summary: "剖析行业割裂与提效现实，厘清模型能力边界，给出职业与技术判断方向。",
            summaryHighlights: [{ text: "模型能力边界", tone: "green" }],
            link: "https://wx.zsxq.com/group/48884124114188/topic/45811251281585418"
          },
          {
            title: "一文彻底搞懂 OpenClaw：原理·架构·Skills·部署",
            titleHighlights: [{ text: "OpenClaw", tone: "green" }],
            summary: "深度解析将自然语言变成新操作系统交互层的开源项目，覆盖原理、Skills 与本地化部署。",
            summaryHighlights: [
              { text: "新操作系统交互层", tone: "green" },
              { text: "本地化部署", tone: "green" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/22811421281248111"
          },
          {
            title: "《OpenClaw：吹响 AI Agent 时代号角》行业研报",
            titleHighlights: [{ text: "AI Agent", tone: "green" }],
            summary: "预测 Agent 市场到 2031 年突破 3.5 亿规模，并给出算力需求、Token 消耗与国产模型投资建议。",
            summaryHighlights: [
              { text: "3.5 亿", tone: "green" },
              { text: "Token 消耗", tone: "green" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/45811251585128458"
          }
        ]
      },
      {
        key: "multimodal",
        tone: "blue",
        icon: "MM",
        title: "多模态实战指南",
        description: "把模型工具、工作流与企业落地路径连起来，帮助团队从 Demo 更快走向真实应用。",
        items: [
          {
            title: "Google Gemini 3.1 Flash Live · 实时多模态智能体",
            titleHighlights: [
              { text: "Gemini 3.1 Flash Live", tone: "blue" },
              { text: "实时多模态智能体", tone: "blue" }
            ],
            summary: "围绕低延迟语音到语音模型，给出官方 API、定价与交互智能体实现线索。",
            summaryHighlights: [{ text: "低延迟语音到语音模型", tone: "blue" }],
            link: "https://wx.zsxq.com/group/48884124114188/topic/55188458514411214",
            resources: [
              { label: "模型卡", url: "https://deepmind.google/models/model-cards/gemini-3-1-flash-live/" },
              { label: "开发者文档", url: "https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-live-preview" },
              { label: "产品博客", url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/" }
            ]
          },
          {
            title: "2026 多模态提示工程与设计工作流",
            titleHighlights: [{ text: "多模态提示工程", tone: "blue" }],
            summary: "展示如何在 5 分钟内用自然语言生成界面原型与交互流程，适合 UX 与 MX 团队快速试验。",
            summaryHighlights: [
              { text: "5 分钟", tone: "blue" },
              { text: "界面原型与交互流程", tone: "blue" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/55188458514452554"
          },
          {
            title: "Multimodal AI in 2026 · 如何改变 Prompt 写法",
            titleHighlights: [{ text: "Prompt", tone: "blue" }],
            summary: "基于 GPT-4o 与 Gemini 总结 MIRO 多模态设计框架，覆盖图像、音频与视频写法对比。",
            summaryHighlights: [
              { text: "MIRO", tone: "blue" },
              { text: "GPT-4o", tone: "blue" },
              { text: "Gemini", tone: "blue" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/55188458514415514"
          },
          {
            title: "企业级多模态落地指南 · Digital Transformation",
            titleHighlights: [{ text: "企业级", tone: "blue" }],
            summary: "解决实验室 Demo 到生产环境之间的断层，覆盖数据治理、模型选型与典型落地步骤。",
            summaryHighlights: [
              { text: "Demo 到生产环境", tone: "blue" },
              { text: "数据治理", tone: "blue" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/14588148451158812"
          }
        ]
      },
      {
        key: "research",
        tone: "orange",
        icon: "RS",
        title: "硬核学术资源",
        description: "聚焦课程、论文与综述，把生成式 AI 和具身智能的底层机制讲得更透。",
        items: [
          {
            title: "扩散模型全体系教学 · 德州大学奥斯汀分校",
            titleHighlights: [{ text: "扩散模型", tone: "orange" }],
            summary: "系统讲解前向加噪、反向去噪、DDIM、蒸馏加速，以及 LoRA 与 ControlNet 的可控生成实践。",
            summaryHighlights: [
              { text: "DDIM", tone: "orange" },
              { text: "LoRA", tone: "orange" },
              { text: "ControlNet", tone: "orange" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/55188458518221184"
          },
          {
            title: "面向通用具身智能的 VLA 代理世界模型综述",
            titleHighlights: [
              { text: "VLA", tone: "orange" },
              { text: "世界模型", tone: "orange" }
            ],
            summary: "梳理视觉、语言、动作与世界模型结合范式，正面回应物理常识缺失与安全性挑战。",
            summaryHighlights: [
              { text: "视觉、语言、动作", tone: "orange" },
              { text: "安全性挑战", tone: "orange" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/55188458515854414",
            resources: [
              { label: "论文地址", url: "https://www.techrxiv.org/users/1019104/articles/1379248-towards-generalist-embodied-ai-a-survey-on-world-models-for-vla-agents" }
            ]
          }
        ]
      },
      {
        key: "frontier-models",
        tone: "violet",
        icon: "FM",
        title: "前沿模型应用",
        description: "把大模型能力映射到真实业务、个人提升与组织协同场景，强调真正可落地的应用框架。",
        items: [
          {
            title: "《GPT-5.4 实战应用完全指南（2026 年）》",
            titleHighlights: [{ text: "GPT-5.4", tone: "violet" }],
            summary: "详解 GPT-5.4 在企业财务、专家咨询、电商运营等场景的应用，展示效率提升与价值创造路径。",
            summaryHighlights: [
              { text: "企业财务", tone: "violet" },
              { text: "专家咨询", tone: "violet" },
              { text: "电商运营", tone: "violet" }
            ],
            link: "https://wx.zsxq.com/group/48884124114188/topic/14588148454885452",
            resources: [
              { label: "电子书预览", url: "https://wx.zsxq.com/mweb/views/weread/search.html?keyword=GPT-5.4实战应用完全指南" }
            ]
          }
        ]
      }
    ],
    values: [
      {
        tone: "green",
        label: "一手资讯",
        description: "第一时间拿到模型发布、技术架构更新与行业研报，不被动追热点。"
      },
      {
        tone: "blue",
        label: "深度解析",
        description: "不止是信息转发，更强调原理、落地难点与商业逻辑的完整拆解。"
      },
      {
        tone: "orange",
        label: "实战工具",
        description: "直接获取 Prompt 框架、部署方案、代码库与企业转型方法。"
      },
      {
        tone: "violet",
        label: "社群价值",
        description: "和同行者共同讨论变化中的模型世界，把判断变成持续迭代的能力。"
      }
    ],
    cta: {
      title: "立即加入知识星球",
      description: "让 AI 成为你更强的学习杠杆、判断系统与生产力引擎。",
      link: "https://wx.zsxq.com/group/48884124114188",
      linkLabel: "立即加入",
      meta: "知识星球 · ID 48884124114188 · 实时更新中"
    }
  }
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

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const renderHighlightedText = (text, highlights = []) => {
  let html = escapeHtml(text);

  highlights.forEach((highlight) => {
    const markedText = escapeHtml(highlight.text);
    html = html.split(markedText).join(
      `<span class="knowledge-mark is-${highlight.tone}">${markedText}</span>`
    );
  });

  return html;
};

const syncKnowledgePlanet = () => {
  const section = siteData.knowledgePlanet;

  if (!section) {
    return;
  }

  const intro = document.querySelector("[data-knowledge-intro]");
  const title = document.querySelector("[data-knowledge-title]");
  const subtitle = document.querySelector("[data-knowledge-subtitle]");
  const statRow = document.querySelector("[data-knowledge-stats]");
  const tagRow = document.querySelector("[data-knowledge-tags]");
  const grid = document.querySelector("[data-knowledge-grid]");
  const values = document.querySelector("[data-knowledge-values]");
  const ctaTitle = document.querySelector("[data-knowledge-cta-title]");
  const ctaDescription = document.querySelector("[data-knowledge-cta-description]");
  const ctaLink = document.querySelector("[data-knowledge-cta-link]");
  const ctaMeta = document.querySelector("[data-knowledge-meta]");

  if (intro) {
    intro.textContent = section.intro;
  }

  if (title) {
    title.textContent = section.title;
  }

  if (subtitle) {
    subtitle.textContent = section.subtitle;
  }

  if (statRow) {
    statRow.innerHTML = section.stats
      .map((item) => `
        <article class="knowledge-stat-pill is-${item.tone}">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </article>
      `)
      .join("");
  }

  if (tagRow) {
    tagRow.innerHTML = section.tags
      .map((item) => `<span class="knowledge-signal-tag is-${item.tone}">${escapeHtml(item.label)}</span>`)
      .join("");
  }

  if (grid) {
    grid.innerHTML = section.themes
      .map((theme) => `
        <article class="panel knowledge-topic-card is-${theme.tone}" data-reveal>
          <div class="knowledge-topic-head">
            <div class="knowledge-topic-icon is-${theme.tone}">${escapeHtml(theme.icon)}</div>
            <div class="knowledge-topic-copy">
              <div class="knowledge-topic-meta">${escapeHtml(theme.description)}</div>
              <h3>${escapeHtml(theme.title)}</h3>
            </div>
            <span class="knowledge-topic-count is-${theme.tone}">${theme.items.length} 篇</span>
          </div>
          <div class="knowledge-topic-items">
            ${theme.items.map((item, index) => `
              <article class="knowledge-topic-item">
                <span class="knowledge-topic-index is-${theme.tone}">${index + 1}</span>
                <div class="knowledge-topic-body">
                  <h4>${renderHighlightedText(item.title, item.titleHighlights)}</h4>
                  <p>${renderHighlightedText(item.summary, item.summaryHighlights)}</p>
                  ${Array.isArray(item.resources) && item.resources.length ? `
                    <div class="knowledge-resource-row">
                      ${item.resources.map((resource) => `
                        <a class="knowledge-resource-link" href="${resource.url}" target="_blank" rel="noreferrer">${escapeHtml(resource.label)}</a>
                      `).join("")}
                    </div>
                  ` : ""}
                </div>
                <a class="knowledge-topic-link is-${theme.tone}" href="${item.link}" target="_blank" rel="noreferrer">原文</a>
              </article>
            `).join("")}
          </div>
        </article>
      `)
      .join("");
  }

  if (values) {
    values.innerHTML = section.values
      .map((item) => `
        <article class="knowledge-value-item is-${item.tone}">
          <span class="knowledge-value-kicker is-${item.tone}">${escapeHtml(item.label)}</span>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `)
      .join("");
  }

  if (ctaTitle) {
    ctaTitle.textContent = section.cta.title;
  }

  if (ctaDescription) {
    ctaDescription.textContent = section.cta.description;
  }

  if (ctaLink) {
    ctaLink.href = section.cta.link;
    ctaLink.textContent = section.cta.linkLabel;
    ctaLink.setAttribute("aria-label", section.cta.title);
  }

  if (ctaMeta) {
    ctaMeta.textContent = section.cta.meta;
  }
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
syncKnowledgePlanet();
syncCounters();
setupMenu();
setupScrollState();
setupReveal();
setupActiveNav();
setupLightbox();
