// main.js — entry point + orchestrasi state, event, dan alur data.
// Modul ini menggantikan peran app.js lama: satu tempat untuk pipeline
// cari → filter → sort, CRUD, dan perpindahan view.

import './style.css';
import { validateProduct } from './products.js';
import { loadProducts, saveProducts, resetProducts } from './store.js';
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

/** Pipeline urut: pencarian → filter kategori → sorting (T-2.1). */
function getVisibleProducts() {
  const query = state.search.trim().toLowerCase();

  const filtered = state.products.filter((product) => {
    const matchesSearch =
      !query ||
      product.nama.toLowerCase().includes(query) ||
      product.deskripsi.toLowerCase().includes(query);
    const matchesCategory =
      state.category === 'Semua' || product.kategori === state.category;
    return matchesSearch && matchesCategory;
  });

  const result = [...filtered];
  switch (state.sort) {
    case 'nama-desc':
      result.sort((a, b) => b.nama.localeCompare(a.nama, 'id', { sensitivity: 'base' }));
      break;
    case 'harga-asc':
      result.sort((a, b) => a.harga - b.harga);
      break;
    case 'harga-desc':
      result.sort((a, b) => b.harga - a.harga);
      break;
    case 'stok-desc':
      result.sort((a, b) => b.stok - a.stok);
      break;
    case 'nama-asc':
    default:
      result.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }));
      break;
  }
  return result;
}

function renderCatalog() {
  const visible = getVisibleProducts();
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
    showToast('Gagal menyimpan, perubahan hanya di sesi ini.');
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
  state.products = loadProducts();
  populateControls();
  renderAll();
  bindEvents();

  const initialView = window.location.hash === '#dashboard' ? 'dashboard' : 'katalog';
  state.view = initialView;
  setView(initialView);
}

initApp();
