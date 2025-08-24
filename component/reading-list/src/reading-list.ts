import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface Book {
  name: string;
  author: string;
  series?: string;
  status: string;
  finished?: string;
  notes?: string;
  grade?: string;
  year?: number;
  sheetName?: string;
}

@customElement("reading-list")
export class ReadingList extends LitElement {
  @property({ attribute: "api-endpoint" })
  apiEndpoint = "/.netlify/functions/reading-list";

  @state()
  private books: Book[] = [];

  @state()
  private filteredBooks: Book[] = [];

  @state()
  private loading = false;

  @state()
  private error = "";

  @state()
  private searchTerm = "";

  @state()
  private statusFilter = "";

  @state()
  private seriesFilter = "";

  @state()
  private yearFilter = "";

  @state()
  private gradeFilter = "";

  @state()
  private sortColumn: string | null = null;

  @state()
  private sortDirection: 'asc' | 'desc' = 'asc';

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchBooks();
  }

  private async fetchBooks() {
    this.loading = true;
    this.error = "";

    try {
      const response = await fetch(this.apiEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      this.books = data.books || [];
      this.filteredBooks = [...this.books];
    } catch (error) {
      this.error = `Failed to load reading list: ${error instanceof Error ? error.message : "Unknown error"}`;
      console.error("Error fetching books:", error);
    } finally {
      this.loading = false;
    }
  }

  private formatDate(dateString: string): string | null {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid date
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  }

  private renderGrade(grade?: string) {
    if (!grade) return html`<span class="not-applicable">—</span>`;

    // Extract the base letter (A, B, C, D, F) from grades like A+, A-, B+, etc.
    const baseLetter = grade.charAt(0).toLowerCase();

    return html`<span class="grade-badge grade-${baseLetter}">${grade}</span>`;
  }

  private renderFinishedDate(date?: string, status?: string) {
    if (!date) {
      return status === "finished"
        ? html`<span class="not-applicable">No date</span>`
        : html`<span class="not-applicable">—</span>`;
    }
    return html`<span class="completion-date">${this.formatDate(date)}</span>`;
  }

  private getAvailableSeries(): string[] {
    const series = [
      ...new Set(
        this.books
          .map((book) => book.series)
          .filter((series): series is string => Boolean(series)),
      ),
    ];
    return series.sort();
  }

  private getAvailableYears(): number[] {
    const years = [
      ...new Set(
        this.books
          .map((book) => book.year)
          .filter((year): year is number => typeof year === "number"),
      ),
    ];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  }

  private getAvailableStatuses(): string[] {
    return ["Finished", "Ah Naw", "Reading", "Not started", "Maybe Later"];
  }

  private getAvailableGrades(): string[] {
    // Normalize grades to uppercase and remove duplicates
    const gradesSet = new Set<string>();

    this.books
      .map((book) => book.grade)
      .filter((grade): grade is string => Boolean(grade?.trim()))
      .forEach((grade) => {
        // Normalize to uppercase (B+ instead of b+)
        gradesSet.add(grade.toUpperCase());
      });

    const grades = Array.from(gradesSet);

    // Sort grades in a logical order: A+, A, A-, B+, B, B-, etc.
    return grades.sort((a, b) => {
      const getGradeValue = (grade: string) => {
        const letter = grade.charAt(0).toUpperCase();
        const modifier = grade.slice(1);
        let value = 0;

        switch (letter) {
          case "A":
            value = 400;
            break;
          case "B":
            value = 300;
            break;
          case "C":
            value = 200;
            break;
          case "D":
            value = 100;
            break;
          case "F":
            value = 0;
            break;
          default:
            value = -100; // Unknown grades go last
        }

        if (modifier === "+") value += 30;
        else if (modifier === "-") value -= 30;

        return value;
      };

      return getGradeValue(b) - getGradeValue(a); // Sort descending (A+ to F)
    });
  }

  private applyFilters() {
    // First filter the books
    this.filteredBooks = this.books.filter((book) => {
      const matchesSearch =
        !this.searchTerm ||
        book.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (book.series &&
          book.series.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus =
        !this.statusFilter || book.status === this.statusFilter;

      const matchesSeries =
        !this.seriesFilter || book.series === this.seriesFilter;

      const matchesYear =
        !this.yearFilter || book.year?.toString() === this.yearFilter;

      const matchesGrade =
        !this.gradeFilter || book.grade?.toUpperCase() === this.gradeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeries &&
        matchesYear &&
        matchesGrade
      );
    });

    // Then sort the filtered results
    if (this.sortColumn) {
      this.filteredBooks.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (this.sortColumn) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'author':
            aValue = a.author.toLowerCase();
            bValue = b.author.toLowerCase();
            break;
          case 'series':
            aValue = (a.series || '').toLowerCase();
            bValue = (b.series || '').toLowerCase();
            break;
          case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
          case 'year':
            aValue = a.year || 0;
            bValue = b.year || 0;
            break;
          case 'grade':
            // Sort grades by their value (A+ > A > A- > B+ etc.)
            const getGradeValue = (grade?: string) => {
              if (!grade) return -1;
              const letter = grade.charAt(0).toUpperCase();
              const modifier = grade.slice(1);
              let value = 0;
              
              switch (letter) {
                case 'A': value = 400; break;
                case 'B': value = 300; break;
                case 'C': value = 200; break;
                case 'D': value = 100; break;
                case 'F': value = 0; break;
                default: value = -100;
              }
              
              if (modifier === '+') value += 30;
              else if (modifier === '-') value -= 30;
              
              return value;
            };
            aValue = getGradeValue(a.grade);
            bValue = getGradeValue(b.grade);
            break;
          case 'finished':
            // Sort by date, treating empty dates as very old
            aValue = a.finished ? new Date(a.finished).getTime() : 0;
            bValue = b.finished ? new Date(b.finished).getTime() : 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  private handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  private handleStatusFilter(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.applyFilters();
  }

  private handleSeriesFilter(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.seriesFilter = target.value;
    this.applyFilters();
  }

  private handleYearFilter(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.yearFilter = target.value;
    this.applyFilters();
  }

  private handleGradeFilter(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.gradeFilter = target.value;
    this.applyFilters();
  }

  private handleSort(column: string) {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, start with ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  private clearAllFilters() {
    this.searchTerm = "";
    this.statusFilter = "";
    this.yearFilter = "";
    this.gradeFilter = "";
    this.seriesFilter = "";
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  private renderFilters() {
    const series = this.getAvailableSeries();
    const years = this.getAvailableYears();
    const statuses = this.getAvailableStatuses();
    const grades = this.getAvailableGrades();

    return html`
      <div class="filters">
        <div class="filter-group">
          <label for="search">Search Books</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, author, or series..."
            .value=${this.searchTerm}
            @input=${this.handleSearch}
          />
        </div>
        <div class="filter-group">
          <label for="status-filter">Filter by Status</label>
          <select
            id="status-filter"
            .value=${this.statusFilter}
            @change=${this.handleStatusFilter}
          >
            <option value="">All Statuses</option>
            ${statuses.map(
              (status) => html`<option value="${status}">${status}</option>`,
            )}
          </select>
        </div>
        <div class="filter-group">
          <label for="year-filter">Filter by Year</label>
          <select
            id="year-filter"
            .value=${this.yearFilter}
            @change=${this.handleYearFilter}
          >
            <option value="">All Years</option>
            ${years.map(
              (year) => html`<option value="${year}">${year}</option>`,
            )}
          </select>
        </div>
        <div class="filter-group">
          <label for="grade-filter">Filter by Grade</label>
          <select
            id="grade-filter"
            .value=${this.gradeFilter}
            @change=${this.handleGradeFilter}
          >
            <option value="">All Grades</option>
            ${grades.map(
              (grade) => html`<option value="${grade}">${grade}</option>`,
            )}
          </select>
        </div>
        <div class="filter-group">
          <label for="series-filter">Filter by Series</label>
          <select
            id="series-filter"
            .value=${this.seriesFilter}
            @change=${this.handleSeriesFilter}
          >
            <option value="">All Series</option>
            ${series.map((s) => html`<option value="${s}">${s}</option>`)}
          </select>
        </div>
        <div class="filter-group">
          <button
            class="clear-filters-btn"
            @click=${this.clearAllFilters}
            type="button"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    `;
  }

  private renderTable() {
    if (this.filteredBooks.length === 0) {
      return html`
        <div class="no-results">No books found matching your filters.</div>
      `;
    }

    return html`
      <table>
        <thead>
          <tr>
            <th>
              <button class="sort-header" @click=${() => this.handleSort('name')}>
                Book
                ${this.sortColumn === 'name' ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            </th>
            <th>
              <button class="sort-header" @click=${() => this.handleSort('series')}>
                Series
                ${this.sortColumn === 'series' ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            </th>
            <th>
              <button class="sort-header" @click=${() => this.handleSort('status')}>
                Status
                ${this.sortColumn === 'status' ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            </th>
            <th>
              <button class="sort-header" @click=${() => this.handleSort('year')}>
                Year
                ${this.sortColumn === 'year' ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            </th>
            <th>
              <button class="sort-header" @click=${() => this.handleSort('finished')}>
                Finished
                ${this.sortColumn === 'finished' ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            </th>
            <th>
              <button class="sort-header" @click=${() => this.handleSort('grade')}>
                Grade
                ${this.sortColumn === 'grade' ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            </th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredBooks.map(
            (book) => html`
              <tr>
                <td>
                  <div class="book-title">${book.name}</div>
                  <div class="book-author">by ${book.author}</div>
                </td>
                <td>
                  ${book.series
                    ? html`<span class="series-badge">${book.series}</span>`
                    : html`<span class="not-applicable">—</span>`}
                </td>
                <td>
                  <span
                    class="status-badge status-${book.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}"
                  >
                    ${book.status}
                  </span>
                </td>
                <td>
                  ${book.year
                    ? html`<span class="year-badge">${book.year}</span>`
                    : html`<span class="not-applicable">—</span>`}
                </td>
                <td>${this.renderFinishedDate(book.finished, book.status)}</td>
                <td>${this.renderGrade(book.grade)}</td>
                <td>
                  ${book.notes || html`<span class="not-applicable">—</span>`}
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <p>Loading reading list...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error">
          <p>${this.error}</p>
        </div>
      `;
    }

    return html`
      <div class="container">
        ${this.renderFilters()}

        <div class="table-container">${this.renderTable()}</div>
      </div>
    `;
  }

  static styles = css`
    :host {
      --primary-color: #2563eb;
      --text-color: #1f2937;
      --text-secondary: #6b7280;
      --border-color: #e5e7eb;
      --bg-color: #ffffff;
      --bg-hover: #f9fafb;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --danger-color: #ef4444;

      display: block;
      font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
        Arial, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
    }

    * {
      box-sizing: border-box;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
      font-weight: 300;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin: 0;
    }

    .loading,
    .error {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .error {
      color: var(--danger-color);
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 12px;
    }

    .filters {
      background: var(--bg-color);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .filter-group input,
    .filter-group select {
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .filter-group input:focus,
    .filter-group select:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .filter-group:has(.clear-filters-btn) {
      justify-content: center;
      align-items: stretch;
    }

    .clear-filters-btn {
      display: inline-block;
      padding: 0.25em 1em;
      background: #1b2f36; /* --gunmetal from main.css */
      color: #fafafa; /* --seasalt from main.css */
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* --shadow from main.css */
      text-decoration: none;
      font: inherit;
      border: none;
      cursor: pointer;
      align-self: center;
    }

    .clear-filters-btn:active,
    .clear-filters-btn:hover {
      color: #fafafa; /* --seasalt */
      background: linear-gradient(
        135deg,
        #4d5963 0% 20%,
        #f79103 20% 40%,
        #376170 40% 60%,
        #906b56 60% 80%,
        #1b2f36 80% 100%
      ); /* --gradient */
    }

    .clear-filters-btn:focus-visible {
      color: #fafafa; /* --seasalt */
      outline: 2px solid #906b56; /* --raw-umber */
      outline-offset: 1px;
      background: linear-gradient(
        135deg,
        #4d5963 0% 20%,
        #f79103 20% 40%,
        #376170 40% 60%,
        #906b56 60% 80%,
        #1b2f36 80% 100%
      ); /* --gradient */
    }

    .table-container {
      background: var(--bg-color);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: var(--bg-hover);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.025em;
      border-bottom: 2px solid var(--border-color);
    }

    th:has(.sort-header) {
      padding: 0;
    }

    .sort-header {
      width: 100%;
      padding: 1rem;
      background: transparent;
      border: none;
      text-align: left;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.025em;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
      white-space: nowrap;
    }

    .sort-header:hover {
      background-color: var(--border-color);
      color: var(--text-color);
    }

    .sort-header:focus {
      outline: none;
      background-color: var(--primary-color);
      color: white;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      vertical-align: top;
    }

    tbody tr:hover {
      background-color: var(--bg-hover);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .status-badge {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-reading {
      background-color: #dbeafe;
      color: #1d4ed8;
    }

    .status-finished {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-ah.naw,
    .status-ah-naw {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .status-not.started,
    .status-not-started {
      background-color: #f3f4f6;
      color: #374151;
    }

    .status-maybe.later,
    .status-maybe-later {
      background-color: #fef3c7;
      color: #92400e;
    }

    .book-title {
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.25rem;
      text-transform: capitalize;
    }

    .book-author {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: capitalize;
    }

    .series-badge {
      background-color: var(--bg-hover);
      color: var(--text-secondary);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-style: italic;
    }

    .year-badge {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .grade-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-align: center;
      min-width: 2rem;
      text-transform: uppercase;
    }

    .grade-a {
      background-color: #d1fae5;
      color: #065f46;
    }

    .grade-b {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .grade-c {
      background-color: #fef3c7;
      color: #92400e;
    }

    .grade-d {
      background-color: #fed7aa;
      color: #c2410c;
    }

    .grade-f {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .completion-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .not-applicable {
      color: #9ca3af;
      font-style: italic;
      font-size: 0.875rem;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      .filters {
        grid-template-columns: 1fr;
      }

      .table-container {
        overflow-x: auto;
      }

      table {
        min-width: 800px;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "reading-list": ReadingList;
  }
}
