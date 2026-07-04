import homeContent from "./content/home.json";

renderHomeContent(homeContent);
observeCards();

function renderHomeContent(content) {
    document.title = content.documentTitle || document.title;

    document.getElementById("heroTop").textContent =
        content.hero?.eyebrow || "";
    document.getElementById("heroName").textContent =
        content.hero?.name || "";

    renderLinks(
        document.getElementById("heroLinks"),
        content.hero?.links || []
    );

    const sections = document.getElementById("homeSections");
    sections.replaceChildren(
        ...(content.sections || []).map(createSection)
    );
}

function createSection(section) {
    const card = document.createElement("section");
    card.className = "card fade-in show";

    const title = document.createElement("h2");
    title.textContent = section.title || "";
    card.appendChild(title);

    switch (section.type) {
        case "paragraphs":
            appendParagraphs(card, section.paragraphs || []);
            break;

        case "skills":
            appendSkills(card, section.groups || []);
            break;

        case "experience":
            appendExperience(card, section.items || []);
            break;

        case "certifications":
            appendCertifications(card, section.items || []);
            break;

        case "links":
            appendParagraphs(card, [section.description].filter(Boolean));
            renderLinks(card, section.links || [], "study-grid");
            break;

        default:
            break;
    }

    return card;
}

function appendParagraphs(parent, paragraphs) {
    paragraphs.forEach((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        parent.appendChild(paragraph);
    });
}

function appendSkills(parent, groups) {
    const grid = document.createElement("div");
    grid.className = "skill-grid";

    groups.forEach((group) => {
        const card = document.createElement("div");
        card.className = "skill-card";

        const title = document.createElement("h3");
        title.textContent = group.title || "";
        card.appendChild(title);

        (group.items || []).forEach((item) => {
            const tag = document.createElement("span");
            tag.textContent = item;
            card.appendChild(tag);
        });

        grid.appendChild(card);
    });

    parent.appendChild(grid);
}

function appendExperience(parent, items) {
    const timeline = document.createElement("div");
    timeline.className = "timeline";

    items.forEach((item) => {
        const timelineItem = document.createElement("div");
        timelineItem.className = "timeline-item";

        const dot = document.createElement("div");
        dot.className = "timeline-dot";
        timelineItem.appendChild(dot);

        const content = document.createElement("div");
        content.className = "timeline-content";

        const title = document.createElement("h3");
        title.textContent = item.title || "";
        content.appendChild(title);

        const period = document.createElement("p");
        period.className = "period";
        period.textContent = item.period || "";
        content.appendChild(period);

        const list = document.createElement("ul");
        (item.details || []).forEach((detail) => {
            const listItem = document.createElement("li");
            listItem.textContent = detail;
            list.appendChild(listItem);
        });
        content.appendChild(list);

        timelineItem.appendChild(content);
        timeline.appendChild(timelineItem);
    });

    parent.appendChild(timeline);
}

function appendCertifications(parent, items) {
    const list = document.createElement("div");
    list.className = "cert-list";

    items.forEach((item) => {
        const cert = document.createElement("div");
        cert.className = "cert-card";
        cert.textContent = item;
        list.appendChild(cert);
    });

    parent.appendChild(list);
}

function renderLinks(parent, links, wrapperClass) {
    const wrapper = wrapperClass ? document.createElement("div") : parent;

    if (wrapperClass) {
        wrapper.className = wrapperClass;
    }

    links.forEach((link) => {
        const anchor = document.createElement("a");
        anchor.className = "main-button";
        anchor.href = link.href;
        anchor.textContent = link.label || "";

        if (link.target) {
            anchor.target = link.target;
            anchor.rel = "noopener noreferrer";
        }

        wrapper.appendChild(anchor);
    });

    if (wrapper !== parent) {
        parent.appendChild(wrapper);
    }
}

function observeCards() {
    const fadeElements = document.querySelectorAll('.card');

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }

        });

    }, {
        threshold: 0.15
    });

    fadeElements.forEach(el => {
        observer.observe(el);
    });
}