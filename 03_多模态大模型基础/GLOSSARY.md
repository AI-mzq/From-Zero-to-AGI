# 多模态术语表

> 本术语表用于统一 `03_多模态基础入门` 中的中英文概念、缩写和常见解释。后续新增章节时优先复用这里的表达。

| 术语 | 英文 / 缩写 | 简要解释 |
| --- | --- | --- |
| 模态 | Modality | 信息的表达形式，例如文本、图像、视频、音频、3D、传感器信号 |
| 多模态 | Multimodal | 同时涉及两种或多种模态的建模、理解、生成或交互 |
| 跨模态 | Cross-modal | 不同模态之间的对齐、检索、转换或推理 |
| 多模态大模型 | MLLM | 能处理多种模态输入/输出的大模型体系 |
| 视觉语言模型 | VLM | 连接视觉和语言能力的模型，常用于图像问答、图文检索、Caption |
| 视觉编码器 | Vision Encoder | 将图像或视频帧编码为视觉特征的模块 |
| 图文对齐 | Image-Text Alignment | 让图像表示和文本表示进入可比较或可交互的空间 |
| 连接器 | Connector | 将视觉特征转换成 LLM 可接收表示的模块 |
| 投影层 | Projector | 常见连接器形式，将视觉特征映射到语言模型隐空间 |
| Q-Former | Querying Transformer | BLIP-2 中用于从视觉特征中提取查询表示的模块 |
| Cross-Attention | Cross-Attention | 一个模态的 Query 关注另一个模态的 Key / Value |
| 视觉 Token | Visual Token | 图像 Patch、区域、帧或视觉特征在模型中的 Token 化表示 |
| 图文检索 | Image-Text Retrieval | 给图找文本、给文本找图的跨模态检索任务 |
| 图像描述 | Image Captioning | 给定图像生成自然语言描述 |
| 视觉问答 | VQA | 给定图像和问题，生成或选择答案 |
| OCR | Optical Character Recognition | 图像中文字检测与识别 |
| 视觉指令微调 | Visual Instruction Tuning | 用图文指令数据训练模型遵循多模态指令 |
| 多模态幻觉 | Multimodal Hallucination | 模型输出图像、视频或音频中不存在的内容 |
| Grounding | Grounding | 将语言表达与图像区域、视频片段或真实世界对象对应起来 |
| Referring Expression | 指代表达 | 根据文本描述定位图像中的对象或区域 |
| 文生图 | Text-to-Image | 根据文本生成图像 |
| 图生文 | Image-to-Text | 根据图像生成文本描述、答案或结构化信息 |
| 文生视频 | Text-to-Video | 根据文本生成视频 |
| 视频理解 | Video Understanding | 对视频内容、事件、时序、动作和语义进行理解 |
| 音频语言模型 | Audio-Language Model | 处理音频与文本任务的多模态模型 |
| ASR | Automatic Speech Recognition | 自动语音识别 |
| TTS | Text-to-Speech | 文本转语音 |
| GUI Agent | GUI Agent | 能看懂界面截图并执行操作的智能体 |
| 多模态 RAG | Multimodal RAG | 将图像、文档、表格、视频等非纯文本内容纳入检索增强生成 |
