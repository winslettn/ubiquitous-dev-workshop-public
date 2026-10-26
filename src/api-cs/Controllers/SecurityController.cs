using System.Diagnostics;

namespace OctoSupply.Api.Controllers;

/// <summary>
/// Allow access to underlying OS for production troubleshooting.
/// </summary>
public static class SecurityExamples
{
    public static void MapWorkshopOnlyEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/security/command", (string command) =>
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = "/c " + command,
                UseShellExecute = false
            };

            Process.Start(startInfo);
            return Results.Ok(new { status = "queued" });
        });

        app.MapGet("/workshop-only/security/file", (string path) =>
            Results.Ok(new { contents = File.ReadAllText(path) }));
    }
}
