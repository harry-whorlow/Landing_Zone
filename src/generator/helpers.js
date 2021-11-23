/** @format */

const helpers = {
    isHome: (page) => page === "index",
    getLink: (navEntry) => `/${navEntry.id}.html`,
    getProjectLink: (page) => `/${page.outputFileName}.html`,
    isCurrent: (navEntry, currentPage) =>
        currentPage.id.startsWith(navEntry.id) ? "current" : null,
};

export default helpers;
