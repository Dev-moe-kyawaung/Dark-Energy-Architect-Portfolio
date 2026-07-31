/**
 * DARK ENERGY PORTFOLIO
 * AI Assistant — Calm cinematic architecture guide
 *
 * Required HTML IDs/classes:
 * - .ai-orb
 * - .ai-interface
 * - #aiClose
 * - #aiContent
 * - #aiInput
 * - #aiSubmit
 *
 * Optional:
 * - [data-ai-prompt]  e.g. <button data-ai-prompt="Tell me about projects">Projects</button>
 */

const AIAssistant = (() => {
    const state = {
        initialized: false,
        isOpen: false,
        isTyping: false,
        messages: [],
        typingController: null,
        prefersReducedMotion: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    };

    const selectors = {
        orb: ".ai-orb",
        interface: ".ai-interface",
        close: "#aiClose",
        content: "#aiContent",
        input: "#aiInput",
        submit: "#aiSubmit",
        prompt: "[data-ai-prompt]"
    };

    const getElement = (selector) => document.querySelector(selector);

    const getElements = (selector) => [...document.querySelectorAll(selector)];

    function init() {
        if (state.initialized) return;

        const requiredElements = [
            getElement(selectors.orb),
            getElement(selectors.interface),
            getElement(selectors.content),
            getElement(selectors.input),
            getElement(selectors.submit)
        ];

        if (requiredElements.some((element) => !element)) {
            console.warn(
                "[AIAssistant] Required assistant elements were not found."
            );
            return;
        }

        bindEvents();
        addWelcomeMessage();
        watchMotionPreference();

        state.initialized = true;
    }

    function bindEvents() {
        const orb = getElement(selectors.orb);
        const closeButton = getElement(selectors.close);
        const input = getElement(selectors.input);
        const submitButton = getElement(selectors.submit);

        orb?.addEventListener("click", toggle);

        closeButton?.addEventListener("click", close);

        submitButton?.addEventListener("click", handleSubmit);

        input?.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
            }
        });

        getElements(selectors.prompt).forEach((button) => {
            button.addEventListener("click", () => {
                const prompt = button.dataset.aiPrompt?.trim();
                if (!prompt) return;

                open();
                sendMessage(prompt);
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && state.isOpen) {
                close();
            }
        });
    }

    function watchMotionPreference() {
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        mediaQuery.addEventListener?.("change", (event) => {
            state.prefersReducedMotion = event.matches;
        });
    }

    function addWelcomeMessage() {
        if (state.messages.length > 0) return;

        addMessage({
            role: "assistant",
            text: "Hello. I am the architecture guide. Ask me about system design, project decisions, scalability, performance, or the thinking behind this portfolio."
        });
    }

    function open() {
        const interfaceElement = getElement(selectors.interface);
        const orb = getElement(selectors.orb);

        if (!interfaceElement) return;

        interfaceElement.classList.add("active");
        interfaceElement.setAttribute("aria-hidden", "false");
        orb?.setAttribute("aria-expanded", "true");

        state.isOpen = true;

        window.setTimeout(() => {
            getElement(selectors.input)?.focus();
            scrollToBottom();
        }, state.prefersReducedMotion ? 0 : 220);
    }

    function close() {
        const interfaceElement = getElement(selectors.interface);
        const orb = getElement(selectors.orb);

        if (!interfaceElement) return;

        cancelTyping();

        interfaceElement.classList.remove("active");
        interfaceElement.setAttribute("aria-hidden", "true");
        orb?.setAttribute("aria-expanded", "false");

        state.isOpen = false;
        orb?.focus();
    }

    function toggle() {
        if (state.isOpen) {
            close();
        } else {
            open();
        }
    }

    function handleSubmit() {
        const input = getElement(selectors.input);
        const text = input?.value.trim();

        if (!text || state.isTyping) return;

        input.value = "";
        sendMessage(text);
    }

    async function sendMessage(text) {
        if (!text || state.isTyping) return;

        addMessage({
            role: "user",
            text
        });

        setLoading(true);

        const response = generateResponse(text);

        await wait(state.prefersReducedMotion ? 0 : 420);

        setLoading(false);
        await typeAssistantMessage(response);
    }

    function addMessage(message) {
        state.messages.push(message);

        const content = getElement(selectors.content);
        if (!content) return;

        const messageElement = createMessageElement(message.role);
        const paragraph = document.createElement("p");

        paragraph.textContent = message.text;
        messageElement.appendChild(paragraph);

        content.appendChild(messageElement);
        scrollToBottom();
    }

    function createMessageElement(role = "assistant") {
        const message = document.createElement("div");
        message.className = `ai-message ai-message--${role}`;
        message.dataset.role = role;

        return message;
    }

    async function typeAssistantMessage(text) {
        const content = getElement(selectors.content);
        if (!content) return;

        state.isTyping = true;

        const messageElement = createMessageElement("assistant");
        const paragraph = document.createElement("p");

        messageElement.classList.add("is-typing");
        messageElement.appendChild(paragraph);
        content.appendChild(messageElement);

        scrollToBottom();

        const controller = new AbortController();
        state.typingController = controller;

        if (state.prefersReducedMotion) {
            paragraph.textContent = text;
        } else {
            for (let index = 0; index < text.length; index += 1) {
                if (controller.signal.aborted) {
                    messageElement.remove();
                    state.isTyping = false;
                    return;
                }

                paragraph.textContent += text[index];

                if (index % 3 === 0) {
                    scrollToBottom();
                }

                const char = text[index];
                const delay = /[.,!?]/.test(char)
                    ? 70
                    : 15 + Math.floor(Math.random() * 20);

                await wait(delay);
            }
        }

        messageElement.classList.remove("is-typing");

        state.messages.push({
            role: "assistant",
            text
        });

        state.isTyping = false;
        state.typingController = null;

        scrollToBottom();
    }

    function cancelTyping() {
        if (state.typingController) {
            state.typingController.abort();
            state.typingController = null;
        }

        state.isTyping = false;
        setLoading(false);
    }

    function setLoading(isLoading) {
        const submitButton = getElement(selectors.submit);
        const input = getElement(selectors.input);
        const content = getElement(selectors.content);

        if (!submitButton || !input || !content) return;

        submitButton.disabled = isLoading;
        input.disabled = isLoading;
        input.setAttribute("aria-busy", String(isLoading));

        const existingLoader = content.querySelector(".ai-loading");

        if (!isLoading) {
            existingLoader?.remove();
            return;
        }

        if (existingLoader) return;

        const loader = document.createElement("div");
        loader.className = "ai-loading";
        loader.setAttribute("aria-live", "polite");

        const dots = document.createElement("span");
        dots.textContent = "Thinking quietly";

        loader.appendChild(dots);
        content.appendChild(loader);

        scrollToBottom();
    }

    function scrollToBottom() {
        const content = getElement(selectors.content);

        if (!content) return;

        content.scrollTo({
            top: content.scrollHeight,
            behavior: state.prefersReducedMotion ? "auto" : "smooth"
        });
    }

    function generateResponse(question) {
        const query = question.toLowerCase().trim();

        const has = (...terms) => terms.some((term) => query.includes(term));

        if (has("hello", "hi", "mingalaba", "မင်္ဂလာပါ")) {
            return "Hello. I am here to make the architecture feel calm and understandable. You can ask about projects, performance, system design, cloud strategy, or the visual system behind this portfolio.";
        }

        if (has("project", "projects", "work", "portfolio")) {
            return "The project collection is presented as floating dark-matter panels. Each panel represents a system challenge, the architectural decision behind it, the technology used, and the measurable outcome. This structure keeps technical detail available without overwhelming the first view.";
        }

        if (has("architecture", "architect", "system design", "design system")) {
            return "The architectural approach begins with boundaries: define the domain, identify ownership, protect critical data, and choose communication patterns deliberately. The goal is not maximum complexity; it is a system that remains understandable, observable, and adaptable as it grows.";
        }

        if (has("microservice", "microservices", "monolith", "monolithic")) {
            return "Microservices are useful when independent teams, deployments, and scaling needs justify distributed-system overhead. Otherwise, a well-structured modular monolith is often faster to build, easier to test, and simpler to operate.";
        }

        if (has("performance", "speed", "latency", "slow", "optimize")) {
            return "Performance work starts with measurement. Establish a baseline, inspect the critical path, reduce unnecessary network calls, cache stable results, optimize data access, and monitor real user experience rather than relying only on local benchmarks.";
        }

        if (has("cloud", "aws", "azure", "gcp", "kubernetes", "devops")) {
            return "Cloud architecture should prioritize repeatability and visibility: infrastructure as code, automated deployments, clear environments, least-privilege access, cost guardrails, and observability that connects logs, metrics, and traces.";
        }

        if (has("security", "zero trust", "auth", "authentication", "authorization")) {
            return "Security architecture assumes that no request is trusted by default. Verify identity, grant only the minimum permissions needed, encrypt sensitive traffic and data, rotate secrets, and make audit trails visible from the beginning.";
        }

        if (has("dark", "energy", "animation", "motion", "gravitational", "gravity", "cosmic")) {
            return "The dark-energy visual language uses motion as atmosphere, not distraction. Cosmic pulses run slowly, panels respond softly to proximity, and transitions stay minimal so that architecture and content remain the focal point.";
        }

        if (has("contact", "hire", "collaborate", "consult", "consultation")) {
            return "For a collaboration, begin with the problem: current architecture, scale, constraints, team structure, delivery timeline, and the outcome you need. A clear problem statement makes the first technical conversation much more valuable.";
        }

        if (has("about", "experience", "background", "bio")) {
            return "This portfolio is designed for a senior architect profile: technical leadership, distributed systems, platform strategy, cloud infrastructure, performance engineering, and the ability to translate complex decisions into clear direction for teams.";
        }

        return "I can explain the portfolio through five lenses: architecture, projects, performance, cloud strategy, and the dark-energy interaction system. Try asking something like: “How do you approach scalability?” or “Explain the gravitational panels.”";
    }

    function wait(milliseconds) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, milliseconds);
        });
    }

    return {
        init,
        open,
        close,
        toggle,
        sendMessage,
        cancelTyping
    };
})();

window.AIAssistant = AIAssistant;
