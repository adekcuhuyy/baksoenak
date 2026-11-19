// main.js — entry point + orchestrasi state, event, dan alur data.
// Modul ini menggantikan peran app.js lama: CRUD, event, dan perpindahan view.
// Pipeline cari → filter → sort ada di filterProducts() (products.js).

import './style.css';
import {
  filterProducts,
  parseProductsJson,
  serializeProducts,
  validateProduct,
} from './products.js';
import { loadProductsWithStatus, saveProducts, resetProducts } from './store.js';
import {
  populateControls,
  renderProducts,
  renderEmptyState,
  renderResultCount,
  renderSummary,
  renderDashboardList,
  renderErrors,
  getFormValues,
  fillForm,
  clearForm,
  setEditingState,
  showDataStatus,
  showToast,
  setView,
} from './ui.js';

const byId = (id) => document.getElementById(id);

const state = {
  products: [],
  search: '',
  category: 'Semua',
  sort: 'nama-asc',
  editingId: null,
  view: 'katalog',
};

function renderCatalog() {
  const visible = filterProducts(state.products, {
    search: state.search,
    category: state.category,
    sort: state.sort,
  });
  renderProducts(visible);
  renderEmptyState(visible.length === 0);
  renderResultCount(visible.length, state.products.length);
}

function renderDashboard() {
  renderSummary(state.products);
  renderDashboardList(state.products, { onEdit: handleEdit, onDelete: handleDelete });
}

function renderAll() {
  renderCatalog();
  renderDashboard();
}

/** Setiap mutasi ditulis ke store lalu seluruh tampilan diperbarui. */
function commit(nextProducts, successMessage) {
  const saved = saveProducts(nextProducts);
  state.products = nextProducts;
  renderAll();

  if (!saved) {
    showToast('Gagal menyimpan, perubahan hanya berlaku saat ini.');
  } else if (successMessage) {
    showToast(successMessage);
  }
  return saved;
}

function goToView(view) {
  state.view = view;
  setView(view);
  window.history.replaceState(null, '', view === 'dashboard' ? '#dashboard' : '#katalog');
}

function handleEdit(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;

  fillForm(product);
  state.editingId = id;
  setEditingState(true);
  goToView('dashboard');
  byId('form-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
  byId('fieldNama').focus();
}

function handleDelete(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;

  const confirmed = window.confirm(
    `Hapus ${product.nama}? Tindakan ini tidak bisa dibatalkan pada data demo.`,
  );
  if (!confirmed) return;

  if (state.editingId === id) {
    state.editingId = null;
    clearForm();
    setEditingState(false);
  }
  commit(state.products.filter((item) => item.id !== id), 'Produk dihapus ✓');
}

/** Unduh seluruh produk sebagai file JSON lokal (tanpa server). */
function handleExport() {
  try {
    const blob = new Blob([serializeProducts(state.products)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'baksoenak-products.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);

    const message = `${state.products.length} produk diekspor ke baksoenak-products.json.`;
    showDataStatus(message);
    showToast('Ekspor JSON siap ✓');
  } catch {
    showDataStatus('Ekspor gagal: browser tidak mendukung unduhan file.', true);
    showToast('Ekspor gagal.');
  }
}

/** Impor file JSON: validasi dulu, baru timpa data setelah konfirmasi. */
async function handleImport(event) {
  const input = event.target;
  const file = input.files?.[0];
  input.value = ''; // izinkan mengimpor ulang file yang sama.
  if (!file) return;

  try {
    const text = await file.text();
    const { products, error } = parseProductsJson(text);
    if (error) {
      const message = `Import gagal: ${error} Data tidak diubah.`;
      showDataStatus(message, true);
      showToast(message);
      return;
    }

    const confirmed = window.confirm(
      `Ganti ${state.products.length} produk saat ini dengan ${products.length} produk dari "${file.name}"?`,
    );
    if (!confirmed) {
      showDataStatus('Import dibatalkan; data tidak diubah.');
      return;
    }

    state.editingId = null;
    clearForm();
    setEditingState(false);
    commit(products, `Import ${products.length} produk berhasil ✓`);
    showDataStatus(`${products.length} produk berhasil diimpor dari ${file.name}.`);
  } catch {
    const message = 'Import gagal: file tidak dapat dibaca.';
    showDataStatus(message, true);
    showToast(message);
  }
}

function clearFilters() {
  state.search = '';
  state.category = 'Semua';
  state.sort = 'nama-asc';
  byId('searchInput').value = '';
  byId('categoryFilter').value = 'Semua';
  byId('sortSelect').value = 'nama-asc';
  renderCatalog();
}

function handleSubmit(event) {
  event.preventDefault();

  const { errors, value } = validateProduct(getFormValues());
  renderErrors(errors);
  if (Object.keys(errors).length > 0) {
    showToast('Periksa kembali data produk.');
    return;
  }

  const wasEditing = Boolean(state.editingId);
  let next;

  if (wasEditing) {
    value.id = state.editingId; // id lama dipertahankan saat edit
    next = [...state.products];
    const index = next.findIndex((item) => item.id === state.editingId);
    if (index >= 0) next[index] = value;
    else next.push(value);
  } else {
    next = [...state.products, value];
  }

  commit(next, wasEditing ? 'Produk diperbarui ✓' : 'Produk tersimpan ✓');

  state.editingId = null;
  clearForm();
  setEditingState(false);
}

function bindEvents() {
  byId('searchInput').addEventListener('input', (event) => {
    state.search = event.target.value;
    renderCatalog();
  });

  byId('categoryFilter').addEventListener('change', (event) => {
    state.category = event.target.value;
    renderCatalog();
  });

  byId('sortSelect').addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderCatalog();
  });

  byId('clearFilters').addEventListener('click', clearFilters);
  byId('productForm').addEventListener('submit', handleSubmit);
  byId('exportButton').addEventListener('click', handleExport);
  byId('importButton').addEventListener('click', () => byId('importFile').click());
  byId('importFile').addEventListener('change', handleImport);

  byId('cancelButton').addEventListener('click', () => {
    state.editingId = null;
    clearForm();
    setEditingState(false);
  });

  byId('resetButton').addEventListener('click', () => {
    const confirmed = window.confirm(
      'Kembalikan 5 produk contoh? Perubahan demo saat ini akan diganti.',
    );
    if (!confirmed) return;

    state.editingId = null;
    clearForm();
    setEditingState(false);
    commit(resetProducts(), 'Data contoh dipulihkan ✓');
    showDataStatus('Reset demo selesai: 5 produk contoh dipulihkan.');
  });

  document.querySelectorAll('[data-view-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      goToView(link.dataset.viewLink);
    });
  });

  window.addEventListener('hashchange', () => {
    const view = window.location.hash === '#dashboard' ? 'dashboard' : 'katalog';
    state.view = view;
    setView(view);
  });
}

function initApp() {
  const loaded = loadProductsWithStatus();
  state.products = loaded.products;
  populateControls();
  renderAll();
  bindEvents();

  if (loaded.recovered) {
    const message = `Data tersimpan rusak (${loaded.error}). 5 produk contoh dipulihkan.`;
    showDataStatus(message, true);
    showToast(message);
  }

  const initialView = window.location.hash === '#dashboard' ? 'dashboard' : 'katalog';
  state.view = initialView;
  setView(initialView);
}

initApp();
