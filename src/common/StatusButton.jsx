
export default function StatusButton(props) {
  
    const styles ={
        success: {color: "#006400", backgroundColor: "#32CD32", padding:"2px 4px", borderRadius: '2px', fontSize: "12px", fontWeight: "bold"},
        disabled: {color: "#696969", backgroundColor: "#A9A9A9", padding:"2px 4px", borderRadius: '2px', fontSize: "12px", fontWeight: "bold"},
    };
    return (
        <span style={styles[props.type]}>
            {props.children}
        </span> 
    );
  }