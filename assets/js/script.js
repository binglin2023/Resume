// 页面分节进入视口时触发动画
document.addEventListener('DOMContentLoaded', function () {
	const sections = document.querySelectorAll('.section');

	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, { threshold: 0.12 });

		sections.forEach(s => io.observe(s));
	} else {
		// 不支持则直接显示
		sections.forEach(s => s.classList.add('visible'));
	}

	// 为技能标签添加键盘焦点样式支持
	const skills = document.querySelectorAll('.skill-tag');
	skills.forEach(skill => {
		skill.setAttribute('tabindex', '0');
		skill.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				skill.classList.toggle('active');
			}
		});
	});

	// 为 .main-content li 的文本内容统一包装到 .li-text 中，避免重复缩进
	const listItems = document.querySelectorAll('.main-content li');
	listItems.forEach(li => {
		// 如果已有 .li-text，跳过
		if (li.querySelector('.li-text')) return;

		// 创建一个 span.li-text，把 li 的子节点（文本或元素）移动进去
		const span = document.createElement('span');
		span.className = 'li-text';

		// 将 li 的所有子节点移动到 span 中
		while (li.childNodes.length) {
			span.appendChild(li.childNodes[0]);
		}
		li.appendChild(span);
	});
});
