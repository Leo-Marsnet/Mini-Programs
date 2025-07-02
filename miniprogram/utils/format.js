/**
 * 数据格式化工具类
 * 提供常用的数据处理和格式化方法
 */

/**
 * 格式化时间
 * @param {Date|String|Number} date 时间
 * @param {String} format 格式化模板
 * @returns {String} 格式化后的时间字符串
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 相对时间格式化
 * @param {Date|String|Number} date 时间
 * @returns {String} 相对时间描述
 */
function timeAgo(date) {
  if (!date) return '';

  const now = new Date();
  const target = new Date(date);
  const diff = now - target;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}

/**
 * 格式化文件大小
 * @param {Number} bytes 字节数
 * @param {Number} decimals 小数位数
 * @returns {String} 格式化后的文件大小
 */
function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 格式化数字，添加千分位分隔符
 * @param {Number} num 数字
 * @param {Number} decimals 小数位数
 * @returns {String} 格式化后的数字
 */
function formatNumber(num, decimals = 0) {
  if (isNaN(num)) return '0';

  const parts = Number(num).toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}

/**
 * 格式化金额
 * @param {Number} amount 金额
 * @param {String} currency 货币符号
 * @param {Number} decimals 小数位数
 * @returns {String} 格式化后的金额
 */
function formatMoney(amount, currency = '¥', decimals = 2) {
  const formatted = formatNumber(amount, decimals);
  return `${currency}${formatted}`;
}

/**
 * 格式化百分比
 * @param {Number} value 数值 (0-1)
 * @param {Number} decimals 小数位数
 * @returns {String} 百分比字符串
 */
function formatPercent(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 手机号格式化（隐藏中间4位）
 * @param {String} phone 手机号
 * @returns {String} 格式化后的手机号
 */
function formatPhone(phone) {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 身份证号格式化（隐藏中间部分）
 * @param {String} idCard 身份证号
 * @returns {String} 格式化后的身份证号
 */
function formatIdCard(idCard) {
  if (!idCard) return '';
  if (idCard.length === 15) {
    return idCard.replace(/(\d{6})\d{5}(\d{4})/, '$1*****$2');
  } else if (idCard.length === 18) {
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
  }
  return idCard;
}

/**
 * 姓名格式化（隐藏中间字符）
 * @param {String} name 姓名
 * @returns {String} 格式化后的姓名
 */
function formatName(name) {
  if (!name) return '';
  if (name.length <= 2) {
    return name.charAt(0) + '*';
  } else {
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }
}

/**
 * 银行卡号格式化
 * @param {String} cardNumber 银行卡号
 * @returns {String} 格式化后的银行卡号
 */
function formatBankCard(cardNumber) {
  if (!cardNumber) return '';
  return cardNumber
    .replace(/\s/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

/**
 * 截断文本
 * @param {String} text 文本
 * @param {Number} length 最大长度
 * @param {String} suffix 后缀
 * @returns {String} 截断后的文本
 */
function truncate(text, length = 50, suffix = '...') {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * 格式化URL参数
 * @param {Object} params 参数对象
 * @returns {String} URL参数字符串
 */
function formatUrlParams(params) {
  if (!params || typeof params !== 'object') return '';

  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * 解析URL参数
 * @param {String} url URL字符串
 * @returns {Object} 参数对象
 */
function parseUrlParams(url) {
  const params = {};
  const queryString = url.split('?')[1];

  if (!queryString) return params;

  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}

/**
 * 生成随机字符串
 * @param {Number} length 长度
 * @param {String} chars 字符集
 * @returns {String} 随机字符串
 */
function randomString(
  length = 8,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 深拷贝对象
 * @param {*} obj 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
}

/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {Number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 节流函数
 * @param {Function} func 要执行的函数
 * @param {Number} wait 等待时间
 * @returns {Function} 节流后的函数
 */
function throttle(func, wait = 300) {
  let previous = 0;
  return function (...args) {
    const now = Date.now();
    if (now - previous > wait) {
      previous = now;
      func.apply(this, args);
    }
  };
}

module.exports = {
  formatTime,
  timeAgo,
  formatFileSize,
  formatNumber,
  formatMoney,
  formatPercent,
  formatPhone,
  formatIdCard,
  formatName,
  formatBankCard,
  truncate,
  formatUrlParams,
  parseUrlParams,
  randomString,
  deepClone,
  debounce,
  throttle,
};
