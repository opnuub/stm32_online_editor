"use client"

export default function Footer() {
    return (
        <footer
            style={{
            padding: "0.5rem 0.5rem",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
            <a
            href="https://img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: "0.5rem" }}
            >
            <img
                src="https://img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png"
                alt="Logo"
                style={{ width: "24px", height: "24px" }}
            />
            </a>
            <a
                target="_blank"
                rel="noopener noreferrer"
                style={{
                fontSize: "12px",
                color: "#007bff",
                textDecoration: "none",
                }}
                href="http://beian.miit.gov.cn/"
            >
                琼ICP备2024046740号 琼公网安备46020002000219号
            </a>
        </div>
        </footer>
    )
}