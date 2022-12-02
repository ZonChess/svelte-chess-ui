<script lang="ts">
  import type { TabType } from "../../../store/chess/type";
  import Tabs from "../../../ui/Tabs/Tabs.svelte";
  import AnalysisTab from "../analysis.tab/AnalysisTab.svelte";

  let tabs: TabType[] = [
    {
      name: "Analysis",
      content: AnalysisTab,
      isActive: true,
      icon: "chess-board-search",
      dataCy: "sidebar-selected-tab-analysis",
    },
    // {
    //   name: "New Game",
    //   content: AnalysisTab,
    //   isActive: false,
    //   icon: "chess-board-search",
    //   dataCy: "sidebar-selected-tab-analysis",
    // },
    // {
    //   name: "Games",
    //   content: AnalysisTab,
    //   isActive: false,
    //   icon: "chess-board-search",
    //   dataCy: "sidebar-selected-tab-analysis",
    // },
    // {
    //   name: "Players",
    //   content: AnalysisTab,
    //   isActive: false,
    //   icon: "chess-board-search",
    //   dataCy: "sidebar-selected-tab-analysis",
    // },
  ];
</script>

<Tabs {tabs} classes="sidebar-tab-content-component sidebar-view-content" />
