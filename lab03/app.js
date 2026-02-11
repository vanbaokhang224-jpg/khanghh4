'use strict';

// Cấu hình API và các phần tử DOM
const API_BASE = 'https://api.escuelajs.co/api/v1/products?offset=0&limit=100';
const productTableBody = document.getElementById('productTableBody');
const searchInput = document.getElementById('searchInput');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const paginationInfo = document.getElementById('paginationInfo');
const descriptionPanel = document.getElementById('descriptionPanel');

// Khởi tạo Bootstrap Modal
const detailModal = new bootstrap.Modal(document.getElementById('productModal'), { 
    backdrop: 'static', 
    keyboard: true 
});
const createModal = new bootstrap.Modal(document.getElementById('createModal'), { 
    backdrop: 'static' 
});

// Trạng thái ứng dụng
let products = [];
let currentPage = 1;
let pageSize = 10;
let searchTerm = '';
let sortKey = '';
let sortDir = 'asc';

/**
 * Làm sạch URL ảnh từ API (Xử lý các lỗi chuỗi từ API của Escuelajs)
 */
function cleanImageUrl(url) {
    if (!url) return 'https://via.placeholder.com/150?text=No+Image';
    let cleaned = String(url).trim().replace(/^\["?|"?\]$/g, '').replace(/^"|"$/g, '');
    try {
        new URL(cleaned);
        return cleaned;
    } catch {
        return 'https://via.placeholder.com/150?text=Error+Image';
    }
}

/**
 * Mở modal chi tiết sản phẩm
 */
function openDetailModal(product) {
    document.getElementById('productModalLabel').textContent = `Chi tiết: ${product.title}`;
    document.getElementById('productIdInput').value = product.id;
    document.getElementById('productTitleInput').value = product.title;
    document.getElementById('productPriceInput').value = product.price;
    document.getElementById('productDescriptionInput').value = product.description;
    document.getElementById('productCategoryNameInput').value = product.category?.name || 'N/A';
    
    const imagesList = document.getElementById('productModalImages');
    imagesList.innerHTML = '';
    (product.images || []).forEach(url => {
        const img = document.createElement('img');
        img.src = cleanImageUrl(url);
        img.className = 'img-thumbnail';
        img.style.width = '100px';
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        imagesList.appendChild(img);
    });

    detailModal.show();
}

/**
 * Hiển thị dữ liệu lên bảng
 */
function getFilteredSorted() {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(term));
    if (!sortKey) return filtered;
    const sorted = [...filtered].sort((a, b) => {
        const av = a?.[sortKey];
        const bv = b?.[sortKey];
        if (sortKey === 'title') {
            return String(av).localeCompare(String(bv), 'vi', { sensitivity: 'base' });
        }
        return Number(av) - Number(bv);
    });
    return sortDir === 'asc' ? sorted : sorted.reverse();
}

function getPagedItems(list) {
    const totalPages = Math.ceil(list.length / pageSize) || 1;
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    return {
        items: list.slice(start, start + pageSize),
        totalPages
    };
}

function renderTable() {
    const filtered = getFilteredSorted();
    const { items, totalPages } = getPagedItems(filtered);

    productTableBody.innerHTML = '';
    
    if (items.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Không tìm thấy sản phẩm</td></tr>';
    } else {
        items.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'product-row';
            row.innerHTML = `
                <td><span class="badge bg-light text-dark border">${product.id}</span></td>
                <td class="fw-medium">${product.title}</td>
                <td class="text-primary fw-bold">$${product.price}</td>
                <td><span class="category-tag">${product.category?.name || 'Chưa phân loại'}</span></td>
                <td><img src="${cleanImageUrl(product.images?.[0])}" class="rounded shadow-sm" width="45" height="45" style="object-fit: cover;"></td>
            `;
            
            row.addEventListener('click', () => openDetailModal(product));
            row.addEventListener('mouseenter', () => {
                descriptionPanel.innerHTML = `<strong>Mô tả:</strong> ${product.description}`;
                descriptionPanel.classList.add('active');
            });
            row.addEventListener('mouseleave', () => {
                descriptionPanel.textContent = 'Di chuột vào sản phẩm để xem mô tả chi tiết.';
                descriptionPanel.classList.remove('active');
            });
            
            productTableBody.appendChild(row);
        });
    }

    paginationInfo.textContent = `Trang ${currentPage} / ${totalPages} (${filtered.length} sản phẩm)`;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
    updateSortButtons();
}

function updateSortButtons() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        const key = btn.dataset.sort;
        if (key === sortKey) {
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-primary');
            btn.textContent = sortDir === 'asc' ? 'Tăng dần' : 'Giảm dần';
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
            btn.textContent = 'Sắp xếp';
        }
    });
}

/**
 * Tải dữ liệu từ API
 */
async function fetchProducts() {
    try {
        const response = await fetch(API_BASE, { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        products = Array.isArray(data) ? data : (data?.data || data?.products || []);
        if (!Array.isArray(products)) {
            throw new Error('API response is not an array');
        }
        renderTable();
    } catch (error) {
        console.error("Lỗi:", error);
        paginationInfo.textContent = 'Không thể tải dữ liệu. Hãy chạy trang qua server nội bộ (không mở file trực tiếp).';
    }
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    renderTable();
});

document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.sort;
        if (sortKey === key) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey = key;
            sortDir = 'asc';
        }
        currentPage = 1;
        renderTable();
    });
});

pageSizeSelect.addEventListener('change', (e) => {
    pageSize = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
});

document.getElementById('prevPageBtn').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderTable(); }
});

document.getElementById('nextPageBtn').addEventListener('click', () => {
    currentPage++; renderTable();
});

document.querySelectorAll('.create-product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('createForm').reset();
        createModal.show();
    });
});

document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const filtered = getFilteredSorted();
    const { items } = getPagedItems(filtered);
    const header = ['id', 'title', 'price', 'category', 'images'];
    const rows = items.map(p => [
        p.id,
        p.title,
        p.price,
        p.category?.name || '',
        (p.images || []).join(' | ')
    ]);
    const csv = [header, ...rows]
        .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_page_${currentPage}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('productIdInput').value;
    const payload = {
        title: document.getElementById('productTitleInput').value.trim(),
        price: Number(document.getElementById('productPriceInput').value || 0),
        description: document.getElementById('productDescriptionInput').value.trim()
    };
    try {
        const response = await fetch(`${API_BASE.split('?')[0]}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Update failed');
        const updated = await response.json();
        const idx = products.findIndex(p => String(p.id) === String(updated.id));
        if (idx !== -1) products[idx] = updated;
        renderTable();
        detailModal.hide();
    } catch (error) {
        console.error('Lỗi update:', error);
        alert('Cập nhật thất bại. Vui lòng thử lại.');
    }
});

document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const imagesRaw = document.getElementById('createImagesInput').value.trim();
    const payload = {
        title: document.getElementById('createTitleInput').value.trim(),
        price: Number(document.getElementById('createPriceInput').value || 0),
        description: document.getElementById('createDescriptionInput').value.trim(),
        categoryId: Number(document.getElementById('createCategoryIdInput').value || 1),
        images: imagesRaw ? imagesRaw.split(',').map(s => s.trim()).filter(Boolean) : []
    };
    try {
        const response = await fetch(API_BASE.split('?')[0], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Create failed');
        const created = await response.json();
        products.unshift(created);
        currentPage = 1;
        renderTable();
        createModal.hide();
    } catch (error) {
        console.error('Lỗi tạo:', error);
        alert('Tạo mới thất bại. Vui lòng thử lại.');
    }
});

// Khởi chạy
fetchProducts();
