import { ref } from 'vue'

export function useTabBar(tabs, initialId) {
  const activeTab = ref(initialId ?? tabs[0]?.id)

  function setTab(id) {
    activeTab.value = id
  }

  function isActive(id) {
    return activeTab.value === id
  }

  return { activeTab, setTab, isActive }
}
