const helpers = {
    isHome: (page) => page === "index",
    getLink: (navEntry) => `/${navEntry.id}`,
    getProjectLink: (page) => `/${page.outputFileName}`,
    getNavClass: (navEntry, currentPage) => {
        return currentPage.id.startsWith(navEntry)
            ? `${navEntry} current`
            : navEntry;
    },
};

export default helpers;
