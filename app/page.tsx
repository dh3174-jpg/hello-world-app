import { createClient } from "@supabase/supabase-js";

export default async function Home() {
  const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
  );

  const { data: tasks, error } = await supabase
      .from("hello-world")
      .select("*");

  if (error) {
    return <p>Error: {error.message}</p>;
  }

    return (
        <main style={{ padding: "40px" }}>
            <h1>My Tasks</h1>

            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginTop: "20px",
                }}
            >
                <thead>
                <tr>
                    <th style={{ border: "1px solid black", padding: "10px" }}>
                        ID
                    </th>
                    <th style={{ border: "1px solid black", padding: "10px" }}>
                        Tasks
                    </th>
                    <th style={{ border: "1px solid black", padding: "10px" }}>
                        Completed or Not
                    </th>
                </tr>
                </thead>

                <tbody>
                {tasks?.map((task) => (
                    <tr key={task.id}>
                        <td style={{ border: "1px solid black", padding: "10px" }}>
                            {task.id}
                        </td>

                        <td style={{ border: "1px solid black", padding: "10px" }}>
                            {task.Tasks}
                        </td>

                        <td style={{ border: "1px solid black", padding: "10px" }}>
                            {task["Completed or Not"] ?? "Not completed"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
