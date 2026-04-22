export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <p style={styles.text}>
                    © {new Date().getFullYear()} Fitness App. All rights reserved.
                </p>

                <div style={styles.links}>
                    <a href="#" style={styles.link}>Privacy Policy</a>
                    <a href="#" style={styles.link}>Terms</a>
                    <a href="#" style={styles.link}>Contact</a>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        width: "100%",
        backgroundColor: "rgb(70 152 157)",
        color: "white",
        padding: "15px 0",
        marginTop: "auto"
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
        flexWrap: "wrap"
    },
    text: {
        margin: 0,
        fontSize: "14px"
    },
    links: {
        display: "flex",
        gap: "15px"
    },
    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "14px"
    }
};