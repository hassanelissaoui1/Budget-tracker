import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/v1/transactions";
const CATEGORY_API_URL = "http://localhost:8080/api/v1/categories";

function DashboardPage({ userEmail, onLogout, userFirstName, userLastName, userName }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [transactionName, setTransactionName] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("weekly");
  const [currentPeriodDate, setCurrentPeriodDate] = useState(new Date());
  const [analyticsViewMode, setAnalyticsViewMode] = useState("weekly");
  const [analyticsPeriodDate, setAnalyticsPeriodDate] = useState(new Date());
  const [categoryViewMode, setCategoryViewMode] = useState("weekly");
  const [categoryPeriodDate, setCategoryPeriodDate] = useState(new Date());
  const [tableYear, setTableYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!userEmail) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user?email=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        setMessage("Unable to load transactions");
        return;
      }

      const data = await response.json();

      const mappedTransactions = data.map((item) => ({
        id: item.transaction_id,
        name: item.transaction_name,
        category: item.transaction_category,
        date: item.transaction_date ? item.transaction_date.substring(0, 10) : "",
        amount: Number(item.transaction_amount),
        type: item.transaction_type
      }));

      setTransactions(mappedTransactions);
    } catch (error) {
      setMessage("Unable to contact the server");
    }
  }, [userEmail]);

  const loadCategories = useCallback(async () => {
    if (!userEmail) {
      return;
    }

    try {
      const response = await fetch(`${CATEGORY_API_URL}/user?email=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setCategories([]);
    }
  }, [userEmail]);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [loadTransactions, loadCategories]);

  function parseDate(dateValue) {
    const parts = dateValue.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  function addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  function addYears(date, years) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }

  function isSameDay(firstDate, secondDate) {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  function getStartOfWeek(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    newDate.setDate(newDate.getDate() - newDate.getDay());
    return newDate;
  }

  function getEndOfWeek(date) {
    return addDays(getStartOfWeek(date), 6);
  }

  function formatShortDate(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }

  function formatMonthYear(date) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  }

  function getPeriodLabel() {
    return getPeriodLabelByMode(viewMode, currentPeriodDate);
  }

  function getPeriodLabelByMode(mode, periodDate) {
    if (mode === "weekly") {
      const selectedStart = getStartOfWeek(periodDate);
      const currentStart = getStartOfWeek(new Date());
      const lastStart = addDays(currentStart, -7);

      if (isSameDay(selectedStart, currentStart)) {
        return "This Week";
      }

      if (isSameDay(selectedStart, lastStart)) {
        return "Last Week";
      }

      const selectedEnd = getEndOfWeek(periodDate);
      return `${formatShortDate(selectedStart)} - ${formatShortDate(selectedEnd)}`;
    }

    if (mode === "monthly") {
      return formatMonthYear(periodDate);
    }

    return String(periodDate.getFullYear());
  }

  function handlePreviousPeriod() {
    updatePeriodBackward(viewMode, setCurrentPeriodDate);
  }

  function handleNextPeriod() {
    updatePeriodForward(viewMode, setCurrentPeriodDate);
  }

  function updatePeriodBackward(mode, setPeriodDate) {
    if (mode === "weekly") {
      setPeriodDate((previous) => addDays(previous, -7));
      return;
    }

    if (mode === "monthly") {
      setPeriodDate((previous) => addMonths(previous, -1));
      return;
    }

    setPeriodDate((previous) => addYears(previous, -1));
  }

  function updatePeriodForward(mode, setPeriodDate) {
    if (mode === "weekly") {
      setPeriodDate((previous) => addDays(previous, 7));
      return;
    }

    if (mode === "monthly") {
      setPeriodDate((previous) => addMonths(previous, 1));
      return;
    }

    setPeriodDate((previous) => addYears(previous, 1));
  }

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(search.toLowerCase()) ||
    transaction.category.toLowerCase().includes(search.toLowerCase())
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  function getMonthIncome(year, monthIndex) {
    return transactions
      .filter((transaction) => {
        const date = parseDate(transaction.date);
        return date.getFullYear() === year && date.getMonth() === monthIndex && transaction.type === "income";
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function getMonthExpense(year, monthIndex) {
    return transactions
      .filter((transaction) => {
        const date = parseDate(transaction.date);
        return date.getFullYear() === year && date.getMonth() === monthIndex && transaction.type === "expense";
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  function getMonthBalance(year, monthIndex) {
    return getMonthIncome(year, monthIndex) - getMonthExpense(year, monthIndex);
  }

  function getBalanceBetween(startDate, endDate) {
    return transactions
      .filter((transaction) => {
        const date = parseDate(transaction.date);
        return date >= startDate && date <= endDate;
      })
      .reduce((sum, transaction) => {
        if (transaction.type === "income") {
          return sum + transaction.amount;
        }

        return sum - transaction.amount;
      }, 0);
  }

  function getDayBalance(targetDate) {
    return transactions
      .filter((transaction) => {
        const date = parseDate(transaction.date);
        return isSameDay(date, targetDate);
      })
      .reduce((sum, transaction) => {
        if (transaction.type === "income") {
          return sum + transaction.amount;
        }

        return sum - transaction.amount;
      }, 0);
  }

  function getChartData() {
    if (viewMode === "weekly") {
      const startOfWeek = getStartOfWeek(currentPeriodDate);
      const labels = [];
      const values = [];

      for (let index = 0; index < 7; index++) {
        const day = addDays(startOfWeek, index);
        labels.push(weekDays[day.getDay()]);
        values.push(getDayBalance(day));
      }

      return {
        labels,
        values
      };
    }

    if (viewMode === "monthly") {
      const year = currentPeriodDate.getFullYear();
      const month = currentPeriodDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      const labels = [];
      const values = [];

      for (let week = 0; week < 5; week++) {
        const startDay = week * 7 + 1;
        const endDay = Math.min(startDay + 6, lastDayOfMonth);

        if (startDay <= lastDayOfMonth) {
          const startDate = new Date(year, month, startDay);
          const endDate = new Date(year, month, endDay);
          labels.push(`W${week + 1}`);
          values.push(getBalanceBetween(startDate, endDate));
        }
      }

      return {
        labels,
        values
      };
    }

    const year = currentPeriodDate.getFullYear();

    return {
      labels: shortMonths,
      values: shortMonths.map((month, index) => getMonthBalance(year, index))
    };
  }

  function isTransactionInPeriod(transaction, mode, periodDate) {
    const date = parseDate(transaction.date);

    if (mode === "weekly") {
      const startOfWeek = getStartOfWeek(periodDate);
      const endOfWeek = getEndOfWeek(periodDate);
      return date >= startOfWeek && date <= endOfWeek;
    }

    if (mode === "monthly") {
      return (
        date.getFullYear() === periodDate.getFullYear() &&
        date.getMonth() === periodDate.getMonth()
      );
    }

    return date.getFullYear() === periodDate.getFullYear();
  }

  const allCategoryOptions = Array.from(
    new Set([
      ...categories,
      ...transactions
        .map((transaction) => transaction.category)
        .filter((category) => category && category.trim() !== "")
    ])
  ).sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory));

  const categoryOptions = Array.from(
    new Set(
      transactions
        .filter((transaction) => transaction.type === "expense")
        .map((transaction) => transaction.category)
        .filter((category) => category && category.trim() !== "")
    )
  ).sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory));

  const activeCategory = selectedCategory && categoryOptions.includes(selectedCategory) ? selectedCategory : categoryOptions[0] || "";

  const expenseColors = ["#f36b2f", "#df424a", "#ffad5f", "#3b2ac7", "#2c9b66", "#7b61ff", "#ff6b9a"];

  const expenseCategoryData = Object.values(
    transactions
      .filter((transaction) => transaction.type === "expense" && isTransactionInPeriod(transaction, analyticsViewMode, analyticsPeriodDate))
      .reduce((result, transaction) => {
        const category = transaction.category || "Other";

        if (!result[category]) {
          result[category] = {
            category: category,
            amount: 0
          };
        }

        result[category].amount += transaction.amount;
        return result;
      }, {})
  ).sort((firstCategory, secondCategory) => secondCategory.amount - firstCategory.amount);

  const totalCategoryExpense = expenseCategoryData.reduce((sum, item) => sum + item.amount, 0);

  let currentExpensePercentage = 0;

  const expenseDonutGradient = totalCategoryExpense === 0
    ? "conic-gradient(#eef0f7 0% 100%)"
    : `conic-gradient(${expenseCategoryData.map((item, index) => {
        const start = currentExpensePercentage;
        const percentage = (item.amount / totalCategoryExpense) * 100;
        const end = start + percentage;
        currentExpensePercentage = end;
        return `${expenseColors[index % expenseColors.length]} ${start}% ${end}%`;
      }).join(", ")})`;

  const categoryTransactions = transactions
    .filter((transaction) => {
      if (!activeCategory) {
        return false;
      }

      return transaction.type === "expense" && transaction.category === activeCategory && isTransactionInPeriod(transaction, categoryViewMode, categoryPeriodDate);
    })
    .sort((firstTransaction, secondTransaction) => parseDate(secondTransaction.date) - parseDate(firstTransaction.date));

  const categoryTransactionData = categoryTransactions
    .map((transaction) => ({
      id: transaction.id,
      name: transaction.name,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
      amount: transaction.amount,
      absoluteAmount: Math.abs(transaction.amount)
    }))
    .sort((firstTransaction, secondTransaction) => secondTransaction.absoluteAmount - firstTransaction.absoluteAmount);

  const selectedCategoryTotal = categoryTransactionData.reduce((sum, item) => sum + item.absoluteAmount, 0);

  let currentCategoryPercentage = 0;

  const categoryDonutGradient = selectedCategoryTotal === 0
    ? "conic-gradient(#eef0f7 0% 100%)"
    : `conic-gradient(${categoryTransactionData.map((item, index) => {
        const start = currentCategoryPercentage;
        const percentage = (item.absoluteAmount / selectedCategoryTotal) * 100;
        const end = start + percentage;
        currentCategoryPercentage = end;
        return `${expenseColors[index % expenseColors.length]} ${start}% ${end}%`;
      }).join(", ")})`;

  const chartData = getChartData();
  const chartLabels = chartData.labels;
  const chartValues = chartData.values;
  const maxChartValue = Math.max(...chartValues.map((value) => Math.abs(value)), 1);

  const chartPoints = chartValues.map((value, index) => {
    const x = chartValues.length === 1 ? 385 : 50 + index * (660 / (chartValues.length - 1));
    const y = 165 - ((value + maxChartValue) / (maxChartValue * 2)) * 120;
    return { x, y, value };
  });

  const chartLine = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const chartArea = `50,195 ${chartPoints.map((point) => `${point.x},${point.y}`).join(" ")} 710,195`;

  function resetForm() {
    setEditingId(null);
    setTransactionName("");
    setTransactionCategory(activeCategory || "");
    setTransactionDate("");
    setTransactionAmount("");
    setTransactionType("expense");
  }

  function openAddForm() {
    resetForm();
    setFormVisible(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const formData = new URLSearchParams();
    formData.append("name", transactionName);
    formData.append("category", transactionCategory);
    formData.append("date", transactionDate);
    formData.append("amount", transactionAmount);
    formData.append("type", transactionType);

    if (!editingId) {
      formData.append("email", userEmail);
    }

    try {
      const url = editingId ? `${API_URL}/update/${editingId}` : `${API_URL}/add`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });

      if (!response.ok) {
        setMessage("Operation failed");
        return;
      }

      await loadTransactions();
      await loadCategories();
      resetForm();
      setFormVisible(false);
    } catch (error) {
      setMessage("Unable to contact the server");
    }
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);
    setTransactionName(transaction.name);
    setTransactionCategory(transaction.category);
    setTransactionDate(transaction.date);
    setTransactionAmount(transaction.amount);
    setTransactionType(transaction.type);
    setFormVisible(true);
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        setMessage("Delete failed");
        return;
      }

      await loadTransactions();
      await loadCategories();
    } catch (error) {
      setMessage("Unable to contact the server");
    }
  }

  const availableYears = Array.from(
    new Set([
      new Date().getFullYear(),
      currentPeriodDate.getFullYear(),
      ...transactions.map((transaction) => parseDate(transaction.date).getFullYear())
    ])
  ).sort((firstYear, secondYear) => secondYear - firstYear);

  const detailsYear = tableYear;

  function getUserInitials() {
    const storedFirstName = localStorage.getItem("userFirstName") || localStorage.getItem("firstName") || localStorage.getItem("prenom") || "";
    const storedLastName = localStorage.getItem("userLastName") || localStorage.getItem("lastName") || localStorage.getItem("nom") || "";
    const firstName = userFirstName || storedFirstName;
    const lastName = userLastName || storedLastName;

    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    if (userName) {
      const parts = userName.trim().split(" ").filter((part) => part !== "");
      return parts.slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
    }

    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }

    return "U";
  }

  return (
    <div className={darkMode ? "dashboard-page dark-mode" : "dashboard-page"}>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
          }

          body {
            background: #f8eeee;
            overflow: hidden;
          }

          .dashboard-page {
            width: 100vw;
            height: 100vh;
            padding: 22px;
            background: linear-gradient(135deg, #fff4f4, #f6f7ff);
            overflow: hidden;
          }

          .dashboard-shell {
            display: flex;
            width: 100%;
            height: calc(100vh - 44px);
            min-height: 0;
            border-radius: 34px;
            background: #f4f7ff;
            border: 10px solid #3526b8;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(49, 38, 184, 0.22);
          }

          .sidebar {
            width: 105px;
            height: 100%;
            flex-shrink: 0;
            background: linear-gradient(180deg, #3b2ac7, #2e22a4);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 36px 0;
          }

          .profile-area {
            position: relative;
          }

          .logo {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff7b35, #ff4b6e);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
          }

          .profile-menu {
            position: absolute;
            top: 72px;
            left: 18px;
            width: 150px;
            background: white;
            border-radius: 16px;
            padding: 10px;
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 50;
          }

          .profile-menu button {
            height: 42px;
            border: none;
            border-radius: 12px;
            background: #f4f7ff;
            color: #17172b;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-align: left;
            padding: 0 14px;
          }

          .profile-menu button:hover {
            background: #edeaff;
            color: #3b2ac7;
          }

          .dashboard-content {
            flex: 1;
            height: 100%;
            min-height: 0;
            padding: 28px 34px;
            overflow-y: auto;
            overflow-x: hidden;
          }

          .dashboard-content::-webkit-scrollbar {
            width: 8px;
          }

          .dashboard-content::-webkit-scrollbar-track {
            background: transparent;
          }

          .dashboard-content::-webkit-scrollbar-thumb {
            background: rgba(59, 42, 199, 0.35);
            border-radius: 20px;
          }

          .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
          }

          .page-title h1 {
            font-size: 28px;
            color: #17172b;
          }

          .message {
            color: #dc444b;
            font-weight: 600;
            margin-bottom: 18px;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 18px;
            margin-bottom: 22px;
          }

          .summary-card,
          .chart-card,
          .table-card,
          .transactions-card,
          .analytics-card,
          .category-card {
            background: white;
            border-radius: 24px;
            padding: 20px;
            box-shadow: 0 12px 30px rgba(64, 70, 105, 0.08);
            margin-bottom: 22px;
            min-width: 0;
            max-width: 100%;
          }

          .summary-card h3 {
            color: #8a8d9d;
            font-size: 17px;
            font-weight: 500;
            margin-bottom: 10px;
          }

          .summary-card strong {
            font-size: 32px;
            color: #17172b;
          }

          .income strong {
            color: #2c9b66;
          }

          .expense strong {
            color: #dc444b;
          }

          .main-grid {
            display: grid;
            grid-template-columns: 1.25fr 0.9fr;
            gap: 34px;
            min-width: 0;
          }

          .main-grid > section {
            min-width: 0;
          }

          .section-title {
            font-size: 23px;
            color: #17172b;
          }

          .chart-top-row,
          .analytics-top-row,
          .category-top-row,
          .table-header,
          .transactions-header,
          .ranking-header,
          .category-selected-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 18px;
          }

          .period-navigation {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .period-button {
            border: none;
            background: transparent;
            color: #ff7a1a;
            font-size: 34px;
            cursor: pointer;
            line-height: 1;
          }

          .period-label {
            font-size: 21px;
            font-weight: 700;
            color: #17172b;
            min-width: 160px;
            text-align: center;
          }

          .view-tabs {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 18px;
          }

          .view-tab {
            border: none;
            background: transparent;
            color: #8a8d9d;
            font-size: 16px;
            font-weight: 700;
            padding: 11px 22px;
            border-radius: 18px;
            cursor: pointer;
          }

          .view-tab.active {
            background: #fff0e7;
            color: #ff7a1a;
          }

          .line-chart {
            height: 185px;
            border-radius: 18px;
            overflow: hidden;
          }

          .line-chart svg {
            width: 100%;
            height: 100%;
          }

          .months-row {
            display: flex;
            justify-content: space-between;
            color: #8a8d9d;
            font-size: 14px;
            margin-top: 10px;
          }

          .chart-value {
            font-size: 14px;
            fill: #df424a;
            font-weight: 700;
          }

          .transactions-search {
            margin-bottom: 22px;
          }

          .transactions-search input,
          .transaction-form input,
          .transaction-form select {
            width: 100%;
            height: 50px;
            border-radius: 15px;
            border: 1px solid #d8dce8;
            padding: 0 15px;
            outline: none;
            font-size: 15px;
            background: white;
          }

          .add-btn {
            width: 46px;
            height: 46px;
            border-radius: 15px;
            border: none;
            background: #3b2ac7;
            color: white;
            font-size: 28px;
            cursor: pointer;
          }

          .transaction-list,
          .ranking-list,
          .analytics-content,
          .category-content {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .transaction-item {
            display: grid;
            grid-template-columns: 52px 1fr auto auto;
            gap: 14px;
            align-items: center;
            background: #f7f8fd;
            border-radius: 18px;
            padding: 14px;
          }

          .transaction-icon {
            width: 48px;
            height: 48px;
            border-radius: 15px;
            background: #ffe1e4;
            color: #df424a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
          }

          .transaction-info h4 {
            color: #17172b;
            margin-bottom: 4px;
          }

          .transaction-info p,
          .ranking-main p,
          .ranking-header span,
          .category-selected-title span,
          .empty-analytics {
            color: #8a8d9d;
            font-size: 13px;
            font-weight: 600;
          }

          .transaction-amount {
            font-size: 18px;
            font-weight: 700;
          }

          .income-text {
            color: #2c9b66;
          }

          .expense-text {
            color: #dc444b;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
          }

          .edit-btn,
          .delete-btn {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            font-size: 18px;
          }

          .edit-btn {
            background: #edeaff;
            color: #3b2ac7;
          }

          .delete-btn {
            background: #ffe1e4;
            color: #df424a;
          }

          .category-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 22px;
          }

          .category-controls .view-tabs {
            margin-bottom: 0;
          }

          .category-select,
          .table-year-select {
            height: 42px;
            border-radius: 14px;
            border: 1px solid #d8dce8;
            background: white;
            color: #17172b;
            padding: 0 14px;
            outline: none;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
          }

          .category-select {
            min-width: 220px;
          }

          .donut-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 0;
          }

          .donut {
            width: 175px;
            height: 175px;
            border-radius: 50%;
            position: relative;
            box-shadow: 0 18px 35px rgba(64, 70, 105, 0.12);
          }

          .donut::after {
            content: "";
            position: absolute;
            width: 102px;
            height: 102px;
            border-radius: 50%;
            background: white;
            top: 36.5px;
            left: 36.5px;
          }

          .donut-center {
            position: absolute;
            inset: 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .donut-center strong {
            color: #17172b;
            font-size: 22px;
            font-weight: 800;
          }

          .donut-center span {
            color: #8a8d9d;
            font-size: 13px;
            font-weight: 700;
            margin-top: 4px;
          }

          .ranking-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }

          .ranking-row strong,
          .ranking-header h3,
          .category-selected-title h3 {
            color: #17172b;
            font-size: 17px;
            font-weight: 800;
          }

          .ranking-row span {
            color: #8a8d9d;
            font-size: 15px;
            font-weight: 700;
          }

          .ranking-main {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .ranking-track {
            width: 100%;
            height: 13px;
            border-radius: 999px;
            background: #eef0f7;
            overflow: hidden;
          }

          .ranking-fill {
            height: 100%;
            border-radius: 999px;
          }

          .table-card {
            overflow-x: auto;
          }

          .table-card table {
            width: 100%;
            border-collapse: collapse;
          }

          .table-card th,
          .table-card td {
            border-bottom: 1px solid #eef0f7;
            padding: 13px;
            text-align: left;
            font-size: 14px;
          }

          .table-card td {
            color: #7b7f91;
          }

          .table-income-value {
            color: #2c9b66 !important;
            font-weight: 700;
          }

          .table-expense-value {
            color: #dc444b !important;
            font-weight: 700;
          }

          .form-overlay {
            position: fixed;
            inset: 0;
            background: rgba(18, 18, 30, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 100;
          }

          .transaction-form {
            width: 100%;
            max-width: 460px;
            background: white;
            border-radius: 26px;
            padding: 28px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
          }

          .transaction-form h2 {
            margin-bottom: 20px;
            color: #17172b;
          }

          .transaction-form form {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .form-actions {
            display: flex;
            gap: 12px;
            margin-top: 10px;
          }

          .submit-btn,
          .cancel-btn {
            flex: 1;
            height: 50px;
            border-radius: 15px;
            border: none;
            font-weight: 700;
            cursor: pointer;
          }

          .submit-btn {
            background: #3b2ac7;
            color: white;
          }

          .cancel-btn {
            background: #eef0f7;
            color: #17172b;
          }

          .dark-mode {
            background: #12121c;
          }

          .dark-mode .dashboard-shell,
          .dark-mode .dashboard-content {
            background: #171827;
          }

          .dark-mode .summary-card,
          .dark-mode .chart-card,
          .dark-mode .table-card,
          .dark-mode .transactions-card,
          .dark-mode .analytics-card,
          .dark-mode .category-card,
          .dark-mode .transaction-form,
          .dark-mode .profile-menu {
            background: #22243a;
          }

          .dark-mode .page-title h1,
          .dark-mode .section-title,
          .dark-mode .summary-card strong,
          .dark-mode .period-label,
          .dark-mode .transaction-info h4,
          .dark-mode .ranking-header h3,
          .dark-mode .ranking-row strong,
          .dark-mode .category-selected-title h3,
          .dark-mode .transaction-form h2,
          .dark-mode .donut-center strong {
            color: white;
          }

          .dark-mode .summary-card h3,
          .dark-mode .transaction-info p,
          .dark-mode .ranking-row span,
          .dark-mode .ranking-main p,
          .dark-mode .ranking-header span,
          .dark-mode .category-selected-title span,
          .dark-mode .empty-analytics,
          .dark-mode .donut-center span {
            color: #b8bbca;
          }

          .dark-mode .transaction-item,
          .dark-mode .profile-menu button,
          .dark-mode .cancel-btn {
            background: #2b2e47;
            color: white;
          }

          .dark-mode input,
          .dark-mode select {
            background: #2b2e47;
            color: white;
            border-color: #3a3d58;
          }

          .dark-mode input::placeholder {
            color: #b8bbca;
          }

          .dark-mode .summary-card.income strong {
            color: #2c9b66;
          }

          .dark-mode .summary-card.expense strong {
            color: #dc444b;
          }

          .dark-mode .donut::after {
            background: #22243a;
          }

          @media (max-width: 1200px) {
            .dashboard-page {
              padding: 16px;
            }

            .dashboard-shell {
              height: calc(100vh - 32px);
            }

            .summary-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .summary-grid .summary-card:first-child {
              grid-column: 1 / -1;
            }

            .main-grid {
              grid-template-columns: 1fr;
              gap: 0;
            }
          }

          @media (max-width: 900px) {
            body {
              overflow: auto;
            }

            .dashboard-page {
              width: 100%;
              height: auto;
              min-height: 100vh;
              padding: 0;
              overflow: visible;
            }

            .dashboard-shell {
              display: block;
              width: 100%;
              height: auto;
              min-height: 100vh;
              border: none;
              border-radius: 0;
              overflow: visible;
            }

            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              width: 100%;
              height: 82px;
              z-index: 1000;
              flex-direction: row;
              justify-content: center;
              padding: 14px;
              box-shadow: 0 10px 25px rgba(49, 38, 184, 0.25);
            }

            .logo {
              width: 56px;
              height: 56px;
            }

            .profile-menu {
              position: fixed;
              top: 68px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 1100;
            }

            .dashboard-content {
              height: auto;
              padding: 102px 14px 14px;
              overflow: visible;
            }

            .summary-grid {
              grid-template-columns: 1fr;
            }

            .summary-grid .summary-card:first-child {
              grid-column: auto;
            }

            .chart-top-row,
            .analytics-top-row,
            .category-top-row,
            .table-header,
            .transactions-header,
            .category-selected-title,
            .ranking-row {
              flex-direction: column;
              align-items: stretch;
            }

            .period-navigation {
              width: 100%;
              display: grid;
              grid-template-columns: 36px 1fr 36px;
              align-items: center;
            }

            .period-label {
              min-width: 0;
              font-size: 16px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .view-tabs,
            .analytics-tabs,
            .category-tabs {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              width: 100%;
            }

            .view-tab {
              min-width: 0;
              width: 100%;
              padding: 10px 4px;
              font-size: 14px;
              text-align: center;
            }

            .line-chart {
              height: 175px;
            }

            .chart-value {
              display: none;
            }

            .months-row {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 0;
              font-size: 12px;
              text-align: center;
            }

            .category-controls {
              flex-direction: column;
              align-items: stretch;
            }

            .category-select,
            .table-year-select {
              width: 100%;
              min-width: 0;
            }

            .transaction-item {
              grid-template-columns: 42px 1fr;
            }

            .transaction-amount,
            .action-buttons {
              grid-column: 2;
            }

            .table-card table {
              min-width: 480px;
            }
          }


          @media (min-width: 901px) {
            html,
            body,
            #root {
              width: 100%;
              height: 100%;
              overflow: hidden !important;
            }

            body {
              overflow: hidden !important;
            }

            .dashboard-page {
              --dashboard-scale: 0.80;
              width: 100vw !important;
              height: 100vh !important;
              min-height: 100vh !important;
              padding: 18px !important;
              overflow: hidden !important;
            }

            .dashboard-shell {
              width: calc(100% / var(--dashboard-scale)) !important;
              height: calc((100vh - 36px) / var(--dashboard-scale)) !important;
              min-height: 0 !important;
              max-height: none !important;
              transform: scale(var(--dashboard-scale)) !important;
              transform-origin: top left !important;
              overflow: hidden !important;
            }

            .sidebar {
              height: 100% !important;
              position: static !important;
              top: auto !important;
            }

            .dashboard-content {
              height: 100% !important;
              max-height: 100% !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              padding: 32px 38px !important;
            }

            .summary-grid {
              grid-template-columns: 1.5fr 1fr 1fr !important;
            }

            .main-grid {
              grid-template-columns: minmax(0, 1.25fr) minmax(360px, 0.9fr) !important;
            }
          }

          @media (max-width: 900px) {
            html,
            body,
            #root {
              height: auto !important;
              overflow-x: hidden !important;
              overflow-y: auto !important;
            }

            body {
              overflow-y: auto !important;
            }

            .dashboard-page {
              width: 100% !important;
              height: auto !important;
              min-height: 100vh !important;
              overflow: visible !important;
            }

            .dashboard-shell {
              transform: none !important;
              width: 100% !important;
              height: auto !important;
              min-height: 100vh !important;
              overflow: visible !important;
            }

            .dashboard-content {
              height: auto !important;
              overflow: visible !important;
            }
          }

        `}
      </style>

      <div className="dashboard-shell">
        <aside className="sidebar">
          <div className="profile-area">
            <div className="logo" onClick={() => setProfileMenuVisible(!profileMenuVisible)}>{getUserInitials()}</div>

            {profileMenuVisible && (
              <div className="profile-menu">
                <button type="button" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? "Light mode" : "Dark mode"}
                </button>

                <button type="button" onClick={onLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>


        </aside>

        <main className="dashboard-content">
          <div className="top-bar">
            <div className="page-title">
              <h1>My Activity</h1>

            </div>


          </div>

          {message && <p className="message">{message}</p>}

          <div className="summary-grid">
            <div className="summary-card">
              <h3>Current Balance</h3>
              <strong>${currentBalance.toFixed(2)}</strong>
            </div>

            <div className="summary-card income">
              <h3>Total Income</h3>
              <strong>${totalIncome.toFixed(2)}</strong>
            </div>

            <div className="summary-card expense">
              <h3>Total Expense</h3>
              <strong>${totalExpense.toFixed(2)}</strong>
            </div>
          </div>

          <div className="main-grid">
            <section>
              <div className="chart-card">
                <div className="chart-top-row">
                  <h2 className="section-title">Activity Summary</h2>

                  <div className="period-navigation">
                    <button type="button" className="period-button" onClick={handlePreviousPeriod}>‹</button>
                    <div className="period-label">{getPeriodLabel()}</div>
                    <button type="button" className="period-button" onClick={handleNextPeriod}>›</button>
                  </div>
                </div>

                <div className="view-tabs">
                  <button
                    type="button"
                    className={viewMode === "weekly" ? "view-tab active" : "view-tab"}
                    onClick={() => setViewMode("weekly")}
                  >
                    Week
                  </button>

                  <button
                    type="button"
                    className={viewMode === "monthly" ? "view-tab active" : "view-tab"}
                    onClick={() => setViewMode("monthly")}
                  >
                    Month
                  </button>

                  <button
                    type="button"
                    className={viewMode === "yearly" ? "view-tab active" : "view-tab"}
                    onClick={() => setViewMode("yearly")}
                  >
                    Year
                  </button>
                </div>

                <div className="line-chart">
                  <svg viewBox="0 0 760 230" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#df424a" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#df424a" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <line x1="50" y1="45" x2="710" y2="45" stroke="#eef0f7" strokeWidth="2" />
                    <line x1="50" y1="85" x2="710" y2="85" stroke="#eef0f7" strokeWidth="2" />
                    <line x1="50" y1="125" x2="710" y2="125" stroke="#eef0f7" strokeWidth="2" />
                    <line x1="50" y1="165" x2="710" y2="165" stroke="#eef0f7" strokeWidth="2" />

                    <polygon points={chartArea} fill="url(#chartGradient)" />

                    <polyline
                      points={chartLine}
                      fill="none"
                      stroke="#df424a"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chartPoints.map((point, index) => (
                      <g key={index}>
                        <circle cx={point.x} cy={point.y} r="7" fill="#df424a" stroke="white" strokeWidth="4" />
                        <text x={point.x - 18} y={point.y - 14} className="chart-value">
                          {point.value}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="months-row">
                  {chartLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="analytics-card">
                <div className="analytics-top-row">
                  <h2 className="section-title">Expense Analytics</h2>

                  <div className="period-navigation">
                    <button type="button" className="period-button" onClick={() => updatePeriodBackward(analyticsViewMode, setAnalyticsPeriodDate)}>‹</button>
                    <div className="period-label">{getPeriodLabelByMode(analyticsViewMode, analyticsPeriodDate)}</div>
                    <button type="button" className="period-button" onClick={() => updatePeriodForward(analyticsViewMode, setAnalyticsPeriodDate)}>›</button>
                  </div>
                </div>

                <div className="view-tabs analytics-tabs">
                  <button
                    type="button"
                    className={analyticsViewMode === "weekly" ? "view-tab active" : "view-tab"}
                    onClick={() => setAnalyticsViewMode("weekly")}
                  >
                    Week
                  </button>

                  <button
                    type="button"
                    className={analyticsViewMode === "monthly" ? "view-tab active" : "view-tab"}
                    onClick={() => setAnalyticsViewMode("monthly")}
                  >
                    Month
                  </button>

                  <button
                    type="button"
                    className={analyticsViewMode === "yearly" ? "view-tab active" : "view-tab"}
                    onClick={() => setAnalyticsViewMode("yearly")}
                  >
                    Year
                  </button>
                </div>

                <div className="analytics-content">
                  {expenseCategoryData.length === 0 && (
                    <p className="empty-analytics">No expenses found</p>
                  )}

                  {expenseCategoryData.length > 0 && (
                    <>
                      <div className="donut-wrapper">
                        <div className="donut" style={{ background: expenseDonutGradient }}>
                          <div className="donut-center">
                            <strong>${totalCategoryExpense.toFixed(2)}</strong>
                            <span>Total</span>
                          </div>
                        </div>
                      </div>

                      <div className="ranking-header">
                        <h3>Expense Ranking</h3>
                        <span>{analyticsViewMode === "weekly" ? "Week" : analyticsViewMode === "monthly" ? "Month" : "Year"}</span>
                      </div>

                      <div className="ranking-list">
                        {expenseCategoryData.map((item, index) => {
                          const percentage = totalCategoryExpense === 0 ? 0 : (item.amount / totalCategoryExpense) * 100;

                          return (
                            <div className="ranking-item" key={item.category}>
                              <div className="ranking-row">
                                <strong>{item.category}</strong>
                                <span>${item.amount.toFixed(2)} - {percentage.toFixed(2)}%</span>
                              </div>

                              <div className="ranking-track">
                                <div
                                  className="ranking-fill"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: expenseColors[index % expenseColors.length]
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="category-card">
                <div className="category-top-row">
                  <h2 className="section-title">Category Transactions</h2>

                  <div className="period-navigation">
                    <button type="button" className="period-button" onClick={() => updatePeriodBackward(categoryViewMode, setCategoryPeriodDate)}>‹</button>
                    <div className="period-label">{getPeriodLabelByMode(categoryViewMode, categoryPeriodDate)}</div>
                    <button type="button" className="period-button" onClick={() => updatePeriodForward(categoryViewMode, setCategoryPeriodDate)}>›</button>
                  </div>
                </div>

                <div className="category-controls">
                  <div className="view-tabs category-tabs">
                    <button
                      type="button"
                      className={categoryViewMode === "weekly" ? "view-tab active" : "view-tab"}
                      onClick={() => setCategoryViewMode("weekly")}
                    >
                      Week
                    </button>

                    <button
                      type="button"
                      className={categoryViewMode === "monthly" ? "view-tab active" : "view-tab"}
                      onClick={() => setCategoryViewMode("monthly")}
                    >
                      Month
                    </button>

                    <button
                      type="button"
                      className={categoryViewMode === "yearly" ? "view-tab active" : "view-tab"}
                      onClick={() => setCategoryViewMode("yearly")}
                    >
                      Year
                    </button>
                  </div>

                  <select
                    className="category-select"
                    value={activeCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {categoryOptions.length === 0 && <option value="">No expense category</option>}

                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="category-content">
                  {!activeCategory && (
                    <p className="empty-analytics">No categories found</p>
                  )}

                  {activeCategory && categoryTransactionData.length === 0 && (
                    <p className="empty-analytics">No transactions found for this category in this period</p>
                  )}

                  {activeCategory && categoryTransactionData.length > 0 && (
                    <>
                      <div className="category-selected-title">
                        <h3>{activeCategory}</h3>
                        <span>{categoryTransactionData.length} transaction(s)</span>
                      </div>

                      <div className="donut-wrapper">
                        <div className="donut" style={{ background: categoryDonutGradient }}>
                          <div className="donut-center">
                            <strong>${selectedCategoryTotal.toFixed(2)}</strong>
                            <span>Total</span>
                          </div>
                        </div>
                      </div>

                      <div className="ranking-header">
                        <h3>Transactions List</h3>
                        <span>{categoryViewMode === "weekly" ? "Week" : categoryViewMode === "monthly" ? "Month" : "Year"}</span>
                      </div>

                      <div className="ranking-list">
                        {categoryTransactionData.map((item, index) => {
                          const percentage = selectedCategoryTotal === 0 ? 0 : (item.absoluteAmount / selectedCategoryTotal) * 100;

                          return (
                            <div className="ranking-item" key={item.id}>
                              <div className="ranking-row">
                                <div className="ranking-main">
                                  <strong>{item.name}</strong>
                                  <p>{item.date} • {item.type}</p>
                                </div>

                                <span className="expense-text">
                                  -${item.amount.toFixed(2)} - {percentage.toFixed(2)}%
                                </span>
                              </div>

                              <div className="ranking-track">
                                <div
                                  className="ranking-fill"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: expenseColors[index % expenseColors.length]
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="table-card">
                <div className="table-header">
                  <h2 className="section-title">Monthly Details - {detailsYear}</h2>

                  <select
                    className="table-year-select"
                    value={tableYear}
                    onChange={(event) => setTableYear(Number(event.target.value))}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expense</th>
                    </tr>
                  </thead>

                  <tbody>
                    {months.map((month, index) => (
                      <tr key={month}>
                        <td>{month}</td>
                        <td className="table-income-value">${getMonthIncome(detailsYear, index).toFixed(2)}</td>
                        <td className="table-expense-value">${getMonthExpense(detailsYear, index).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </section>

            <section>
              <div className="transactions-card">
                <div className="transactions-search">
                  <input
                    type="text"
                    placeholder="Search anything..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <div className="transactions-header">
                  <h2 className="section-title">Recent Transactions</h2>
                  <button className="add-btn" onClick={openAddForm}>+</button>
                </div>

                <div className="transaction-list">
                  {filteredTransactions.length === 0 && <p>No transactions found</p>}

                  {filteredTransactions.map((transaction) => (
                    <div className="transaction-item" key={transaction.id}>
                      <div className="transaction-icon">
                        {transaction.type === "income" ? "↑" : "↓"}
                      </div>

                      <div className="transaction-info">
                        <h4>{transaction.name}</h4>
                        <p>{transaction.category} • {transaction.date}</p>
                      </div>

                      <div className={`transaction-amount ${transaction.type === "income" ? "income-text" : "expense-text"}`}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>

                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(transaction)}>✎</button>
                        <button className="delete-btn" onClick={() => handleDelete(transaction.id)}>⌫</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {formVisible && (
        <div className="form-overlay">
          <div className="transaction-form">
            <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Transaction name"
                value={transactionName}
                onChange={(event) => setTransactionName(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Category"
                list="category-suggestions"
                value={transactionCategory}
                onChange={(event) => setTransactionCategory(event.target.value)}
                required
              />

              <datalist id="category-suggestions">
                {allCategoryOptions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

              <input
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Amount"
                value={transactionAmount}
                onChange={(event) => setTransactionAmount(event.target.value)}
                required
              />

              <select
                value={transactionType}
                onChange={(event) => setTransactionType(event.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update" : "Add"}
                </button>

                <button type="button" className="cancel-btn" onClick={() => setFormVisible(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
