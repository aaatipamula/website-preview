import type { TabPage } from 'src/types/content';
import type { TrieNode } from 'src/types/trie';

import { useEffect, useState } from 'preact/hooks';
import styles from './ContentView.module.css';
import FileTree from './FileTree';

interface Props {
  fileTree: TrieNode[];
  pages: TabPage[];
  slug: string;
}

const ContentView= ({ pages, slug, fileTree }: Props) => {
  // NOTE: Should never be undefined as all slugs are determined at build time
  const activePage = pages.find(p => p.slug === slug)

  const [activeTab, setActiveTab] = useState(activePage!); 
  const [openPages, setOpenPages] = useState(activePage ? [activePage] : []);

  const openPage = (slug: string) => {
    const activePage = pages.find(p => p.slug === slug)!
    // Only update open pages if the page is not already open
    if (!openPages.some(p => p.slug === activePage.slug)) {
      setOpenPages(p => [...p, activePage]) 
    }
    setActiveTab(activePage);
  }

  const closeTab = (slug: string) => {
    setOpenPages(prevPages => {
      const newPages = prevPages.filter(p => p.slug !== slug);

      if (newPages.length === 0) {
        return prevPages;
      }

      // Only update active tab if we're closing the current one
      if (slug === activeTab.slug) {
        const closedTabIndex = prevPages.findIndex(p => p.slug === slug);

        // If there are still tabs left after closing
        if (newPages.length > 0) {
          // Prefer next tab if it exists, otherwise previous one
          const nextIndex = Math.min(closedTabIndex, newPages.length - 1);
          setActiveTab(newPages[nextIndex]);
        }
      }

      return newPages;
    });
  };


  // Update page history when activeTab changes
  useEffect(() => {
    history.pushState({}, '', activeTab.slug);
  }, [activeTab]);

  return (
    <div class={styles.componentContainer}>
      <div class={styles.fileTreeContainer}>
        <button 
          class={styles.websiteHeader}
          onClick={() => openPage('/about')}
        >
          aniketh.dev
        </button>
        {fileTree.map(node => (
          <FileTree 
            node={node}
            click={openPage}
            activeTab={activeTab.slug}
            key={node.name}
          />
        ))}
      </div>
      <div class={styles.contentContainer}>
        <div class={styles.tabListContainer}>
          {openPages.map(page => (
            <button
              onClick={() => setActiveTab(page)}
              class={`${styles.pageTab} ${page.slug === activeTab.slug && styles.activeTab}`}
            >
              {page.slug || 'index'}.md
              <i
                class="bi bi-x-lg"
                onClick={e => { e.stopPropagation(); closeTab(page.slug) }}
                style={{ paddingLeft: '0.5rem', color: 'var(--red)' }}
              ></i>
            </button>
          ))}
        </div>
        <div 
          class={styles.mdContainer}
          dangerouslySetInnerHTML={{
            __html: activeTab.content
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default ContentView;

